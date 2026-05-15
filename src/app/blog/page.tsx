import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — GearUp",
  description: "Automotive insights, marketplace tips, and GearUp updates.",
};

const POSTS = [
  { title: "How to Get the Best Deal on Your Next Used Car", date: "May 12, 2026", category: "Guide", excerpt: "Smart negotiation strategies, market research tips, and how to use GearUp tools to find the best price." },
  { title: "EV vs Hybrid vs Petrol: Which Is Right for You in 2026?", date: "May 8, 2026", category: "Comparison", excerpt: "Breaking down total cost of ownership, environmental impact, and daily usability of each powertrain type." },
  { title: "The Ultimate First-Time Buyer Checklist", date: "May 3, 2026", category: "Guide", excerpt: "Everything you need to know before buying your first car — from budget planning to test drive questions." },
  { title: "GearUp Launches Instant Financing Pre-Approval", date: "Apr 28, 2026", category: "News", excerpt: "Get approved in under 2 minutes with no credit score impact. Available now for all GearUp listings." },
  { title: "Top 10 Most Reliable Used Cars Under ฿500,000", date: "Apr 20, 2026", category: "Rankings", excerpt: "Our team analyzed thousands of listings and owner reviews to find the most dependable budget-friendly cars." },
  { title: "How Dealers Are Using GearUp to Grow Their Business", date: "Apr 15, 2026", category: "Dealer Spotlight", excerpt: "Meet three dealerships that doubled their monthly sales after joining GearUp's verified dealer network." },
];

export default function BlogPage() {
  return (
    <PageShell
      badge="Resources"
      title="GearUp Blog"
      description="Automotive insights, buying guides, and the latest marketplace updates."
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article key={post.title} className="group rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-100" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Tag className="h-3 w-3" /> {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" /> {post.date}
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
