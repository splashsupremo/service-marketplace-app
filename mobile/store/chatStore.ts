import { create } from 'zustand';
import { supabase } from '@/services/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface ConversationSummary {
  id: string;
  customer_id: string;
  provider_id: string;
  last_message_at: string;
  /** Display name of "the other person" relative to the logged-in user */
  otherPersonName: string;
  /** Image to show — provider's logo (if I'm the customer) or null (if I'm the provider, no customer photo available) */
  otherPersonImage: string | null;
  /** True if the logged-in user is the customer in this conversation */
  isCustomerView: boolean;
  unreadCount: number;
  /** The other participant's last_read_at — used for read receipts in chat */
  otherLastReadAt: string | null;
}

interface ChatState {
  conversations: ConversationSummary[];
  isLoadingConversations: boolean;
  totalUnreadCount: number;

  messages: ChatMessage[];
  isLoadingMessages: boolean;
  activeConversation: ConversationSummary | null;
  activeChannel: RealtimeChannel | null;

  fetchConversations: () => Promise<void>;
  startConversation: (providerId: string) => Promise<{ conversationId: string | null; error: string | null }>;
  markAsRead: (conversationId: string) => Promise<void>;

  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<{ error: string | null }>;

  subscribeToMessages: (conversationId: string) => void;
  unsubscribe: () => void;

  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  isLoadingConversations: false,
  totalUnreadCount: 0,

  messages: [],
  isLoadingMessages: false,
  activeConversation: null,
  activeChannel: null,

  /**
  /**
 * fetchConversations
 *
 * Loads all conversations the logged-in user is part of, then
 * separately fetches the related providers and profiles rows needed
 * to display "the other person" — done as two follow-up queries
 * rather than a single nested join, since there's no direct foreign
 * key between `conversations` and `profiles` for PostgREST to
 * traverse automatically (conversations.customer_id and profiles.id
 * both reference auth.users.id independently, not each other).
 */
fetchConversations: async () => {
  set({ isLoadingConversations: true });

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) {
    set({ conversations: [], isLoadingConversations: false, totalUnreadCount: 0 });
    return;
  }

  const { data: conversationsData, error } = await supabase
    .from('conversations')
    .select('id, customer_id, provider_id, last_message_at, customer_last_read_at, provider_last_read_at')
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error.message);
    set({ isLoadingConversations: false });
    return;
  }

  if (!conversationsData || conversationsData.length === 0) {
    set({ conversations: [], isLoadingConversations: false, totalUnreadCount: 0 });
    return;
  }

  // Gather the unique provider ids and customer ids we need extra info for
  const providerIds = [...new Set(conversationsData.map((c) => c.provider_id))];
  const customerIds = [...new Set(conversationsData.map((c) => c.customer_id))];

  const [{ data: providersData }, { data: profilesData }] = await Promise.all([
    supabase.from('providers').select('id, business_name, image_url, user_id').in('id', providerIds),
    supabase.from('profiles').select('id, full_name').in('id', customerIds),
  ]);

  const providersById = new Map((providersData ?? []).map((p) => [p.id, p]));
  const profilesById = new Map((profilesData ?? []).map((p) => [p.id, p]));

  // Fetch unread counts for each conversation
  const unreadCounts = await Promise.all(
    conversationsData.map(async (conv) => {
      const isCustomerView = conv.customer_id === userId;
      const myLastReadAt = isCustomerView ? conv.customer_last_read_at : conv.provider_last_read_at;

      if (!myLastReadAt) {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', userId);
        return { id: conv.id, count: count ?? 0 };
      }

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .neq('sender_id', userId)
        .gt('created_at', myLastReadAt);
      return { id: conv.id, count: count ?? 0 };
    })
  );

  const unreadById = new Map(unreadCounts.map((u) => [u.id, u.count]));

  const summaries: ConversationSummary[] = conversationsData.map((row) => {
    const isCustomerView = row.customer_id === userId;
    const provider = providersById.get(row.provider_id);
    const customerProfile = profilesById.get(row.customer_id);

    return {
      id: row.id,
      customer_id: row.customer_id,
      provider_id: row.provider_id,
      last_message_at: row.last_message_at,
      isCustomerView,
      otherPersonName: isCustomerView
        ? provider?.business_name ?? 'Provider'
        : customerProfile?.full_name ?? 'Customer',
      otherPersonImage: isCustomerView ? provider?.image_url ?? null : null,
      unreadCount: unreadById.get(row.id) ?? 0,
      otherLastReadAt: isCustomerView ? row.provider_last_read_at : row.customer_last_read_at,
    };
  });

  const totalUnread = summaries.reduce((sum, conv) => sum + conv.unreadCount, 0);
  set({ conversations: summaries, isLoadingConversations: false, totalUnreadCount: totalUnread });
},

  /**
   * startConversation
   *
   * Creates a new conversation between the logged-in customer and the
   * given provider, or returns the existing one if they've already
   * messaged before (relying on the unique(customer_id, provider_id)
   * constraint — we check first to avoid an unnecessary insert error).
   */
  startConversation: async (providerId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      return { conversationId: null, error: 'You must be logged in to start a conversation.' };
    }

    const { data: existing, error: lookupError } = await supabase
      .from('conversations')
      .select('id')
      .eq('customer_id', userId)
      .eq('provider_id', providerId)
      .maybeSingle();

    if (lookupError) {
      return { conversationId: null, error: lookupError.message };
    }
    if (existing) {
      return { conversationId: existing.id, error: null };
    }

    const { data: created, error: createError } = await supabase
      .from('conversations')
      .insert({ customer_id: userId, provider_id: providerId })
      .select('id')
      .single();

    if (createError) {
      return { conversationId: null, error: createError.message };
    }

    return { conversationId: created.id, error: null };
  },

  /**
   * markAsRead
   */
  markAsRead: async (conversationId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) return;

    const conv = get().conversations.find((c) => c.id === conversationId);
    const isCustomerView = conv?.isCustomerView ?? true;
    const column = isCustomerView ? 'customer_last_read_at' : 'provider_last_read_at';
    const now = new Date().toISOString();

    await supabase
      .from('conversations')
      .update({ [column]: now })
      .eq('id', conversationId);

    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      );
      const totalUnread = updated.reduce((sum, item) => sum + item.unreadCount, 0);
      return { conversations: updated, totalUnreadCount: totalUnread };
    });
  },

  /**
   * fetchMessages
   */
  fetchMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true });

    const conv = get().conversations.find((c) => c.id === conversationId) ?? null;
    set({ activeConversation: conv });

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error.message);
      set({ isLoadingMessages: false });
      return;
    }

    set({ messages: (data ?? []) as ChatMessage[], isLoadingMessages: false });
  },

  /**
   * sendMessage
   *
   * Inserts a new message. We don't optimistically add it to local
   * state here — the Realtime subscription (already active while the
   * chat screen is open) will receive the INSERT event and append it,
   * keeping a single source of truth for "what's in the message list."
   */
  sendMessage: async (conversationId: string, content: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      return { error: 'You must be logged in to send messages.' };
    }

    const { error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: userId, content });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  /**
   * subscribeToMessages
   *
   * Opens a Realtime channel listening for new messages in the given
   * conversation. Appends each new message to local state as it
   * arrives — this is how both the sender (after sendMessage resolves)
   * and the recipient (live, while viewing the chat) see new messages
   * appear, from a single code path.
   */
  subscribeToMessages: (conversationId: string) => {
    get().unsubscribe(); // ensure no duplicate channel from a previous chat screen

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          set((state) => {
            // Avoid duplicate entries if this client's own sendMessage
            // somehow already added it via another path.
            if (state.messages.some((m) => m.id === newMessage.id)) {
              return state;
            }
            return { messages: [...state.messages, newMessage] };
          });
        }
      )
      .subscribe();

    set({ activeChannel: channel });
  },

  /**
   * unsubscribe
   *
   * Tears down the active Realtime channel. Called when the chat
   * screen unmounts, or before subscribing to a different conversation.
   */
  unsubscribe: () => {
    const channel = get().activeChannel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ activeChannel: null });
    }
  },

  /**
   * reset
   *
   * Called on logout.
   */
  reset: () => {
    get().unsubscribe();
    set({ conversations: [], messages: [], isLoadingConversations: false, isLoadingMessages: false });
  },
}));