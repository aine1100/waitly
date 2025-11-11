"use client";

export default function WaitlistPreview({ count }: { count: number }) {
  // Generate sample avatars
  const avatars = [
    { name: "Alex Chen", initials: "AC", color: "bg-blue-500" },
    { name: "Sarah Kim", initials: "SK", color: "bg-purple-500" },
    { name: "Marcus Johnson", initials: "MJ", color: "bg-green-500" },
    { name: "Elena Rodriguez", initials: "ER", color: "bg-orange-500" },
    { name: "David Park", initials: "DP", color: "bg-pink-500" },
    { name: "Lisa Wang", initials: "LW", color: "bg-indigo-500" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join the Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with researchers, developers, and early adopters already on the waitlist
          </p>
        </div>

        {/* Avatar Grid */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className={`w-16 h-16 ${avatar.color} rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {avatar.initials}
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {avatar.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-background border border-border rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{count}+</div>
              <div className="text-muted-foreground">Waitlist Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-muted-foreground">Researchers</div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">Backed by leading researchers</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">FDA safety compliant</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Open-source compatible</span>
          </div>
        </div>
      </div>
    </section>
  );
}
