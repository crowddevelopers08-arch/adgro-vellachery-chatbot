"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import ThankYouScreen from "./ThankYouScreen";
import { revealDelay } from "./reveal";
import { saveLead } from "@/app/actions";
import { locationOptions, questions } from "@/lib/form-options";

// TODO: replace these placeholders with approved Advanced GroHair Velachery visuals.
const images = {
  clinic: { src: "/crown/1B0A2476.webp", alt: "Procedure room at Advanced GroHair, Velachery" },
  beforeAfter: { src: "/crown/hair-result.webp", alt: "Advanced GroHair hair transplant before and after results" },
  concerns: { src: "/crown/hair-concerns.jpg", alt: "Doctor assessing and marking a patient's hairline" },
};

const clinicAddress = "Second Floor, Block No. 20, Sankaran Avenue, Plot No. 31, Pandian St, Indira Gandhi Nagar, Velachery, Chennai 600042";
const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`Advanced GroHair, ${clinicAddress}`)}&output=embed`;

const trustParagraphs = [
  // TODO: fill in the doctor's name, qualification and years of experience.
  "At Advanced GroHair Velachery, your procedure is planned by [Doctor name, qualification], with 10+ years of experience in hair restoration.",
  "Your plan includes unlimited follicles (within your safe donor limit) and 6 months of free maintenance after the procedure.",
  "Would you like a consultation to check your hair loss grade and eligibility?",
];

export default function HairTransplantQuestion() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(() => 0));
  const [phase, setPhase] = useState<"question" | "result" | "contact" | "location" | "exit" | "thankyou">("question");
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [locationAnswer, setLocationAnswer] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const selected = answers[step];
  const { options, title, name } = questions[step];
  const questionTitleIndex = step === 0 ? 1 : 0;
  const questionButtonIndex = questionTitleIndex + 1 + options.length;
  const questionImageIndex = questionButtonIndex + (step === 0 ? 2 : 1);
  function setSelected(value: number) {
    setAnswers(previous => previous.map((answer, index) => index === step ? value : answer));
  }
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const locationInputs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (phase !== "question" && phase !== "location") return;
    const activeOptions = phase === "location" ? locationOptions : options;
    const handleKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const index = "abcdef".indexOf(event.key.toLowerCase());
      if (event.key.length !== 1 || index < 0 || index >= activeOptions.length) return;
      if (phase === "location") { setLocationAnswer(index); locationInputs.current[index]?.focus(); }
      else { setAnswers(previous => previous.map((answer, position) => position === step ? index : answer)); inputs.current[index]?.focus(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step, options, phase]);
  useEffect(() => {
    if (phase !== "exit") return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") handleExit();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase]);
  useEffect(() => {
    if (phase !== "thankyou") return;
    const timeout = setTimeout(resetAll, 8000);
    return () => clearTimeout(timeout);
  }, [phase]);
  function resetAll() {
    setStep(0);
    setAnswers(questions.map(() => 0));
    setContact({ name: "", phone: "", email: "" });
    setLocationAnswer(0);
    setSaveError("");
    setPhase("question");
  }
  function advance() {
    if (step < questions.length - 1) setStep(step + 1);
    else setPhase("result");
  }
  function previousQuestion() {
    if (phase === "location") { setPhase("contact"); return; }
    if (phase === "contact") { setPhase("result"); return; }
    if (phase === "result") { setPhase("question"); return; }
    setStep(previous => Math.max(0, previous - 1));
  }
  function handleContinue() {
    setPhase("contact");
  }
  function handleContactSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setPhase("location");
  }
  function setContactField(field: keyof typeof contact, value: string) {
    setContact(previous => ({ ...previous, [field]: value }));
  }
  async function handleLocationSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError("");
    const result = await saveLead({ ...contact, answers, locationComfortable: locationAnswer === 0 });
    setSaving(false);
    if (!result.ok) { setSaveError(result.error); return; }
    setPhase(locationAnswer === 1 ? "exit" : "thankyou");
  }
  function handleExit() {
    // TODO: wire up final exit action (e.g. close the widget / navigate away) once the destination is defined.
  }
  if (phase === "exit") {
    return (
      <main key="exit" className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-white px-[7vw] py-16 text-ink">
          <BrandLogo />
        <div className="relative max-w-[620px]">
          <span className="absolute top-0 -left-7 font-serif text-[34px] leading-none text-brand" aria-hidden="true">&ldquo;</span>
          <p className="reveal-in text-[clamp(18px,2.2vw,32px)] leading-[1.35] tracking-[-.3px]" style={revealDelay(0)}>If you’re not comfortable with the clinic location in Velachery, Chennai, you may exit the form and choose not to proceed further.</p>
          <div className="mt-[clamp(20px,4svh,36px)] flex items-center gap-3">
            <button type="button" onClick={handleExit} className="reveal-in h-[46px] cursor-pointer rounded-lg border-0 bg-brand px-6 text-lg font-bold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" style={revealDelay(1)}>Submit</button>
            <span className="reveal-in text-sm text-ink/65" style={revealDelay(2)}>press <b className="font-bold text-ink">Ctrl</b> + <b className="font-bold text-ink">Enter</b> ↵</span>
          </div>
        </div>
        <nav className="fixed right-[7px] bottom-3 flex gap-0.5 [&_button]:grid [&_button]:h-[35px] [&_button]:w-[34px] [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:border-0 [&_button]:bg-brand [&_button]:p-1.5 [&_button]:text-white [&_button:first-child]:rounded-l-[9px] [&_button:last-child]:rounded-r-[9px] [&_button:disabled]:cursor-default [&_button:disabled]:bg-brand/25 [&_button:disabled]:text-white [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-ink [&_svg]:w-[23px] [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-2 [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]" aria-label="Question navigation">
          <button type="button" onClick={() => setPhase("location")} aria-label="Previous question"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 15 7-7 7 7" /></svg></button>
          <button type="button" disabled aria-label="Confirm answer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></button>
        </nav>
      </main>
    );
  }
  if (phase === "thankyou") {
    return <ThankYouScreen name={contact.name} phone={contact.phone} />;
  }
  return (
    <main key={phase === "question" ? `question-${step}` : phase} className="relative isolate h-svh overflow-hidden bg-white text-ink">
      <BrandLogo />
      <div className="grid h-full min-h-0 grid-cols-2 items-center gap-x-[8vw] px-[8vw] pt-[clamp(64px,12svh,100px)] pb-[clamp(44px,7svh,64px)] [@media(max-width:700px)]:grid-cols-1 [@media(max-width:700px)]:grid-rows-[auto_minmax(0,1fr)] [@media(max-width:700px)]:gap-4 [@media(max-width:700px)]:px-[9vw]">
        {phase === "question" ? <>
          <form className="relative min-w-0 w-full" onSubmit={(event) => { event.preventDefault(); advance(); }}>
            <span className="absolute top-[7px] -left-[27px] grid h-5 w-[17px] place-items-center rounded bg-ink text-sm font-bold text-white [@media(max-width:440px)]:top-1 [@media(max-width:440px)]:-left-6" aria-label={`Question ${step + 1}`}>{step + 1}</span>
            {step === 0 && <p className="reveal-in mb-[clamp(12px,3svh,30px)] text-[clamp(17px,min(1.76vw,3.5svh),30px)] leading-[1.3] tracking-[-.4px]" style={revealDelay(0)}>Hair transplant at Advanced GroHair, Velachery: <b className="font-semibold text-brand">₹1,29,000</b> with unlimited follicles and 6 months of free maintenance.</p>}
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="reveal-in mb-[clamp(12px,3svh,30px)] p-0 text-[clamp(17px,min(1.76vw,3.5svh),30px)] leading-[1.3] tracking-[-.4px]" style={revealDelay(questionTitleIndex)}>{title}</legend>
              <div className="flex w-full max-w-[542px] flex-col gap-1.5 [@media(max-width:900px)]:max-w-none">
                {options.map((option, i) => <label key={option} className={`reveal-in relative flex min-h-[clamp(34px,5.8svh,49px)] cursor-pointer items-center gap-2 rounded-[10px] border border-ink/8 px-2.5 py-[clamp(4px,1svh,8px)] text-[clamp(13px,min(1.25vw,2.5svh),20px)] leading-[1.3] tracking-[-.3px] transition-[background,border-color] duration-150 hover:bg-ink/6 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/30 ${selected === i ? "bg-brand/5 outline-2 -outline-offset-1 outline-brand" : "bg-ink/3"}`} style={revealDelay(questionTitleIndex + 1 + i)}>
                  <input className="absolute size-px opacity-0" ref={(element) => { inputs.current[i] = element; }} type="radio" name={name} value={option} checked={selected === i} required onChange={() => setSelected(i)} />
                  <span className={`grid h-[26px] flex-[0_0_25px] place-items-center rounded-[3px] border text-[13px] font-semibold tracking-normal ${selected === i ? "border-brand bg-brand text-white" : "border-ink/20 bg-white"}`} aria-hidden="true">{"ABCDEF"[i]}</span><span>{option}</span>
                </label>)}
              </div>
            </fieldset>
            <button className="reveal-in mt-[clamp(12px,3svh,28px)] h-[clamp(34px,5svh,44px)] min-w-[60px] cursor-pointer rounded-lg border-0 bg-brand px-4 text-xl font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" style={revealDelay(questionButtonIndex)} type="submit">OK</button>
            {step === 0 && <p className="reveal-in mt-[clamp(10px,2svh,18px)] max-w-[542px] text-[clamp(11px,min(.9vw,1.8svh),14px)] leading-[1.4] text-ink/50" style={revealDelay(questionButtonIndex + 1)}>Results vary by individual. Suitability and graft requirement are confirmed after in-clinic consultation.</p>}
          </form>
          {step === 0 ? <div className="reveal-in relative aspect-[3/2] w-full max-w-[calc((100svh-164px)*1.5)] min-h-0 justify-self-center overflow-hidden border border-ink/10 [@media(max-width:700px)]:h-full [@media(max-width:700px)]:max-h-[30svh] [@media(max-width:700px)]:max-w-[360px] [@media(max-width:700px)]:aspect-auto" style={revealDelay(questionImageIndex)}>
            <Image src={images.clinic.src} alt={images.clinic.alt} fill priority className="object-cover" sizes="(max-width: 700px) 82vw, 43vw" />
          </div> : step === 1 ? <figure className="reveal-in relative flex aspect-square w-full max-w-[calc(100svh-164px)] min-h-0 flex-col justify-self-center overflow-hidden border border-ink/10 bg-white [@media(max-width:700px)]:h-full [@media(max-width:700px)]:max-h-[30svh] [@media(max-width:700px)]:max-w-[360px] [@media(max-width:700px)]:aspect-auto" style={revealDelay(questionImageIndex)}>
            <div className="relative min-h-0 flex-1">
              <Image src={images.beforeAfter.src} alt={images.beforeAfter.alt} fill priority className="object-contain" sizes="(max-width: 700px) 82vw, 43vw" />
            </div>
            <figcaption className="shrink-0 bg-white px-3 py-[clamp(6px,1.4svh,12px)] text-center text-[clamp(11px,1vw,15px)] text-ink/70">Individual results may vary</figcaption>
          </figure> : <div className="reveal-in relative aspect-[3/2] w-full max-w-[calc((100svh-164px)*1.5)] min-h-0 justify-self-center overflow-hidden [@media(max-width:700px)]:h-full [@media(max-width:700px)]:max-h-[30svh] [@media(max-width:700px)]:max-w-[360px] [@media(max-width:700px)]:aspect-auto" style={revealDelay(questionImageIndex)}>
            <Image src={images.concerns.src} alt={images.concerns.alt} fill priority className="object-contain" sizes="(max-width: 700px) 82vw, 43vw" />
          </div>}
        </> : phase === "result" ? <>
          <div className="relative min-w-0 w-full">
            <span className="absolute top-0 -left-[27px] font-serif text-[34px] leading-none text-brand [@media(max-width:440px)]:-left-6" aria-hidden="true">&ldquo;</span>
            <p className="reveal-in mb-[clamp(12px,3svh,24px)] text-[clamp(17px,min(1.76vw,3.5svh),30px)] leading-[1.3] tracking-[-.4px]" style={revealDelay(0)}>Choosing the right doctor is an important decision.</p>
            <div className="flex max-w-[542px] flex-col gap-[clamp(10px,2svh,18px)] text-[clamp(13px,min(1.25vw,2.5svh),20px)] leading-[1.5] tracking-[-.3px] text-ink/80">
              {trustParagraphs.map((paragraph, i) => <p key={i} className="reveal-in" style={revealDelay(1 + i)}>{paragraph}</p>)}
            </div>
            <button className="reveal-in mt-[clamp(12px,3svh,28px)] h-[clamp(34px,5svh,44px)] min-w-[60px] cursor-pointer rounded-lg border-0 bg-brand px-4 text-xl font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" style={revealDelay(1 + trustParagraphs.length)} type="button" onClick={handleContinue}>Continue</button>
          </div>
          <div className="reveal-in relative aspect-[3/2] w-full max-w-[calc((100svh-164px)*1.5)] min-h-0 justify-self-center overflow-hidden border border-ink/10 [@media(max-width:700px)]:h-full [@media(max-width:700px)]:max-h-[30svh] [@media(max-width:700px)]:max-w-[360px] [@media(max-width:700px)]:aspect-auto" style={revealDelay(2 + trustParagraphs.length)}>
            <Image src={images.clinic.src} alt={images.clinic.alt} fill priority className="object-cover" sizes="(max-width: 700px) 82vw, 43vw" />
          </div>
        </> : phase === "contact" ? <div className="col-span-2 flex w-full items-center justify-center [@media(max-width:700px)]:col-span-1">
          <form className="relative w-full max-w-[480px]" onSubmit={handleContactSubmit}>
            <span className="absolute top-[7px] -left-[27px] grid h-5 w-[17px] place-items-center rounded bg-ink text-sm font-bold text-white [@media(max-width:440px)]:top-1 [@media(max-width:440px)]:-left-6" aria-label={`Question ${questions.length + 1}`}>{questions.length + 1}</span>
            <p className="reveal-in mb-[clamp(16px,4svh,36px)] text-[clamp(17px,min(1.76vw,3.5svh),30px)] leading-[1.3] tracking-[-.4px]" style={revealDelay(0)}>Please enter your full name and contact info.*</p>
            <div className="flex w-full max-w-[446px] flex-col gap-[clamp(14px,2.6svh,26px)] [@media(max-width:900px)]:max-w-none">
              <label className="reveal-in block" style={revealDelay(1)}>
                <span className="mb-1.5 block text-[clamp(12px,1vw,15px)] text-ink/70">Name*</span>
                <input className="w-full border-0 border-b border-ink/25 bg-transparent pb-2 text-[clamp(14px,1.4vw,19px)] text-ink outline-none placeholder:text-ink/36 focus:border-brand" type="text" placeholder="Karthik Kumar" required autoComplete="name" value={contact.name} onChange={(event) => setContactField("name", event.target.value)} />
              </label>
              <label className="reveal-in block" style={revealDelay(2)}>
                <span className="mb-1.5 block text-[clamp(12px,1vw,15px)] text-ink/70">WhatsApp / Phone number*</span>
                <div className="flex items-center gap-2 border-b border-ink/25 pb-2 focus-within:border-brand">
                  <span className="flex shrink-0 items-center gap-1 text-[clamp(14px,1.4vw,19px)]" aria-hidden="true">
                    🇮🇳
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-2" aria-hidden="true"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="h-4 w-px shrink-0 bg-ink/20" aria-hidden="true" />
                  <input className="min-w-0 flex-1 border-0 bg-transparent text-[clamp(14px,1.4vw,19px)] text-ink outline-none placeholder:text-ink/36" type="tel" placeholder="98765 43210" required value={contact.phone} onChange={(event) => setContactField("phone", event.target.value)} />
                </div>
              </label>
              <label className="reveal-in block" style={revealDelay(3)}>
                <span className="mb-1.5 block text-[clamp(12px,1vw,15px)] text-ink/70">Email</span>
                <input className="w-full border-0 border-b border-ink/25 bg-transparent pb-2 text-[clamp(14px,1.4vw,19px)] text-ink outline-none placeholder:text-ink/36 focus:border-brand" type="email" placeholder="name@example.com" value={contact.email} onChange={(event) => setContactField("email", event.target.value)} />
              </label>
            </div>
            <button className="reveal-in mt-[clamp(16px,3.5svh,32px)] h-[clamp(34px,5svh,44px)] min-w-[60px] cursor-pointer rounded-lg border-0 bg-brand px-4 text-xl font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" style={revealDelay(4)} type="submit">OK</button>
          </form>
        </div> : <>
          <form className="relative min-w-0 w-full" onSubmit={handleLocationSubmit}>
            <span className="absolute top-[7px] -left-[27px] grid h-5 w-[17px] place-items-center rounded bg-ink text-sm font-bold text-white [@media(max-width:440px)]:top-1 [@media(max-width:440px)]:-left-6" aria-label={`Question ${questions.length + 2}`}>{questions.length + 2}</span>
            <p className="reveal-in mb-[clamp(12px,3svh,30px)] text-[clamp(15px,min(1.5vw,3svh),26px)] leading-[1.35] tracking-[-.4px]" style={revealDelay(0)}>Advanced GroHair is located at {clinicAddress}.</p>
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="reveal-in mb-[clamp(12px,3svh,30px)] p-0 text-[clamp(17px,min(1.76vw,3.5svh),30px)] leading-[1.3] tracking-[-.4px]" style={revealDelay(1)}>Are you comfortable with this location for your hair transplant consultation?*</legend>
              <div className="flex w-full max-w-[542px] flex-col gap-1.5 [@media(max-width:900px)]:max-w-none">
                {locationOptions.map((option, i) => <label key={option} className={`reveal-in relative flex min-h-[clamp(34px,5.8svh,49px)] cursor-pointer items-center gap-2 rounded-[10px] border border-ink/8 px-2.5 py-[clamp(4px,1svh,8px)] text-[clamp(13px,min(1.25vw,2.5svh),20px)] leading-[1.3] tracking-[-.3px] transition-[background,border-color] duration-150 hover:bg-ink/6 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/30 ${locationAnswer === i ? "bg-brand/5 outline-2 -outline-offset-1 outline-brand" : "bg-ink/3"}`} style={revealDelay(2 + i)}>
                  <input className="absolute size-px opacity-0" ref={(element) => { locationInputs.current[i] = element; }} type="radio" name="location" value={option} checked={locationAnswer === i} required onChange={() => setLocationAnswer(i)} />
                  <span className={`grid h-[26px] flex-[0_0_25px] place-items-center rounded-[3px] border text-[13px] font-semibold tracking-normal ${locationAnswer === i ? "border-brand bg-brand text-white" : "border-ink/20 bg-white"}`} aria-hidden="true">{"AB"[i]}</span><span>{option}</span>
                </label>)}
              </div>
            </fieldset>
            <button className="reveal-in mt-[clamp(12px,3svh,28px)] h-[clamp(34px,5svh,44px)] min-w-[60px] cursor-pointer rounded-lg border-0 bg-brand px-4 text-xl font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:cursor-wait disabled:opacity-60" style={revealDelay(2 + locationOptions.length)} type="submit" disabled={saving}>{saving ? "Saving…" : "OK"}</button>
            {saveError && <p className="mt-3 text-sm font-medium text-brand" role="alert">{saveError}</p>}
          </form>
          <div className="reveal-in relative flex aspect-[8/5] w-full max-w-[calc((100svh-164px)*1.6)] min-h-0 flex-col justify-self-center overflow-hidden bg-white text-ink [@media(max-width:700px)]:h-full [@media(max-width:700px)]:max-h-[30svh] [@media(max-width:700px)]:max-w-[360px] [@media(max-width:700px)]:aspect-auto" style={revealDelay(3 + locationOptions.length)}>
            <div className="shrink-0 px-4 py-[clamp(8px,1.8svh,16px)] text-center">
              <h2 className="text-[clamp(18px,2.2vw,32px)] leading-[1.1] font-extrabold tracking-tight text-ink">VELACHERY, CHENNAI</h2>
            </div>
            <iframe className="min-h-0 w-full flex-1 border-0" src={mapUrl} title="Map of Advanced GroHair, Velachery" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </>}
      </div>
      <nav className="fixed right-[7px] bottom-3 flex gap-0.5 [&_button]:grid [&_button]:h-[35px] [&_button]:w-[34px] [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:border-0 [&_button]:bg-brand [&_button]:p-1.5 [&_button]:text-white [&_button:first-child]:rounded-l-[9px] [&_button:last-child]:rounded-r-[9px] [&_button:disabled]:cursor-default [&_button:disabled]:bg-brand/25 [&_button:disabled]:text-white [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-ink [&_svg]:w-[23px] [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-2 [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]" aria-label="Question navigation">
        <button type="button" onClick={previousQuestion} disabled={phase === "question" && step === 0} aria-label="Previous question"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 15 7-7 7 7" /></svg></button>
        <button type="button" onClick={advance} disabled={phase !== "question"} aria-label={step < questions.length - 1 ? "Next question" : "Confirm answer"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" /></svg></button>
      </nav>
    </main>
  );
}
