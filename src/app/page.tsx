import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Storytelling } from "@/components/sections/Storytelling";
import { Craft } from "@/components/sections/Craft";
import { AfterEffects } from "@/components/sections/AfterEffects";
import { About } from "@/components/sections/About";
import { Millow } from "@/components/sections/Millow";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

/* Flow strony:
   wow (00–01) → dowód (02) → dlaczego to działa (03–05)
   → kto za tym stoi (06–07) → oferta (08–09) → kontakt (10) */
export default function Page() {
  return (
    <main>
      <Hero />
      <Work />
      <Storytelling />
      <Craft />
      <AfterEffects />
      <About />
      <Millow />
      <Pricing />
      <Process />
      <Contact />
    </main>
  );
}
