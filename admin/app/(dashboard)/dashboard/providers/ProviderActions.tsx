"use client";

import { useState } from "react";
import { toggleVerified, toggleFeatured } from "./actions";
import { CheckCircle, Sparkles } from "lucide-react";

interface Props {
  providerId: string;
  isVerified: boolean;
  isFeatured: boolean;
}

export default function ProviderActions({
  providerId,
  isVerified,
  isFeatured,
}: Props) {
  const [verifiedLoading, setVerifiedLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  async function handleVerify() {
    setVerifiedLoading(true);
    try {
      await toggleVerified(providerId, isVerified);
    } finally {
      setVerifiedLoading(false);
    }
  }

  async function handleFeature() {
    setFeaturedLoading(true);
    try {
      await toggleFeatured(providerId, isFeatured);
    } finally {
      setFeaturedLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleVerify}
        disabled={verifiedLoading}
        title={isVerified ? "Remove verification" : "Verify provider"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
          isVerified
            ? "bg-green-400/10 text-green-400 hover:bg-green-400/20"
            : "bg-slate-800 text-slate-400 hover:text-green-400 hover:bg-green-400/10"
        }`}
      >
        <CheckCircle size={13} />
        {verifiedLoading ? "…" : isVerified ? "Verified" : "Verify"}
      </button>

      <button
        onClick={handleFeature}
        disabled={featuredLoading}
        title={isFeatured ? "Remove from featured" : "Mark as featured"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
          isFeatured
            ? "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
            : "bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"
        }`}
      >
        <Sparkles size={13} />
        {featuredLoading ? "…" : isFeatured ? "Featured" : "Feature"}
      </button>
    </div>
  );
}