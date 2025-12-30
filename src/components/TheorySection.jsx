import { Info, Quote, Network, Palette, Cpu } from "lucide-react";

export function TheorySection() {
  return (
    <div className="space-y-24">
      {/* Bebas pilih mau pake template yang mana 1 atau 2 atau dua-duanya */}
      {/* Konsep Theory 1 - deskriptif */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* --- Frame Gambar --- */}
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--accent-mid)]/20 blur-3xl rounded-full scale-75" />

          <div className="relative glass-card p-3 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="aspect-video lg:aspect-square w-full rounded-[1.5rem] overflow-hidden bg-[var(--accent-deep)]/30 flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" // ganti gambar disini (link)
                alt="Theory Illustration"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-deep)]/40 to-transparent pointer-events-none" />
            </div>

            <div className="mt-4 px-4 pb-2 flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--highlight)] uppercase tracking-[0.2em]">
                Visual Representation
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--highlight)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--highlight)]/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--highlight)]/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Frame Theory */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-[var(--highlight)]/10 border border-[var(--highlight)]/20">
            <span className="flex items-center gap-2 text-xs font-bold text-[var(--highlight)] uppercase tracking-widest">
              <Info size={14} /> Graph Coloring
            </span>
          </div>

          <h3 className="text-3xl lg:text-4xl font-bold text-[var(--text-light)] leading-tight">
            {/* ganti ini: dua teks beda warna buat typography aja (mau pake salah satu gamasalah) */}
            ORBIT <br />
            <span className="text-[var(--highlight)] leading-relaxed">
              Hello, I'm Orbit!
            </span>
          </h3>
          {/* ganti ini: penjelasan */}
          <p className="text-[var(--highlight)] leading-relaxed">
            Wireless networks are the backbone of modern connectivity. However, ensuring optimal performance is challenging due to invisible forces
            like Co-Channel Interference. This occurs when multiple access points compete for the same frequency channel while positioned too close to one another.
            Through this interactive simulation, it will be easier to learn how to configure a network topology to minimize signal clashes and mazimize efficiency.
          </p>
          <div className="flex gap-4 p-4 rounded-2xl bg-[var(--accent-mid)]/10 border border-white/10">
            <div className="shrink-0 text-[var(--highlight)]">
              <Quote size={24} />
            </div>
            {/* ganti ini: kalo mau ada ringkasannya */}
            <p className="text-sm italic text-[var(--text-highlight)]">
              ORBIT is a web-based simulation tool designed to help you visualize, position, and optimalize WiFi channels-specifically 
              for the crowded 2.4GHz frequency.
            </p>
          </div>
        </div>
      </div>

      {/* Konsep Theory 2 - per point */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card p-8 rounded-[2rem] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 group">
          <div className="w-14 h-14 rounded-2xl bg-[var(--highlight)]/10 flex items-center justify-center mb-6 text-[var(--highlight)] group-hover:bg-[var(--highlight)] group-hover:text-[var(--accent-deep)] transition-all duration-300 shadow-inner">
            <Network size={26} />
          </div>
          {/* ganti ini: judul card */}
          <h3 className="text-xl font-bold mb-4 text-[var(--text-light)] tracking-tight">
            Lorem, ipsum.
          </h3>
          {/* ganti ini: deskripsi */}
          <p className="text-sm text-[var(--highlight)]/70 leading-relaxed font-medium">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
            fuga rem ipsa temporibus, neque vel asperiores explicabo maiores
            sapiente rerum, reiciendis debitis dolorem ducimus.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-8 rounded-[2rem] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 group">
          <div className="w-14 h-14 rounded-2xl bg-[var(--highlight)]/10 flex items-center justify-center mb-6 text-[var(--highlight)] group-hover:bg-[var(--highlight)] group-hover:text-[var(--accent-deep)] transition-all duration-300 shadow-inner">
            <Palette size={26} />
          </div>
          {/* ganti ini: judul card */}
          <h3 className="text-xl font-bold mb-4 text-[var(--text-light)] tracking-tight">
            Lorem, ipsum.
          </h3>
          {/* ganti ini: deskripsi */}
          <p className="text-sm text-[var(--highlight)]/70 leading-relaxed font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            ipsum quas doloribus beatae atque rerum sint quasi excepturi quae
            perspiciatis, aperiam ut, ratione quia.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-8 rounded-[2rem] border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 group">
          <div className="w-14 h-14 rounded-2xl bg-[var(--highlight)]/10 flex items-center justify-center mb-6 text-[var(--highlight)] group-hover:bg-[var(--highlight)] group-hover:text-[var(--accent-deep)] transition-all duration-300 shadow-inner">
            <Cpu size={26} />
          </div>
          {/* ganti ini: judul card */}
          <h3 className="text-xl font-bold mb-4 text-[var(--text-light)] tracking-tight">
            Lorem, ipsum.
          </h3>
          {/* ganti ini: deskripsi */}
          <p className="text-sm text-[var(--highlight)]/70 leading-relaxed font-medium">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
            magnam excepturi quis aliquam quo officiis tempore assumenda,
            aperiam doloribus libero! Sunt natus illum eligendi.
          </p>
        </div>
      </div>
    </div>
  );
}
