"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useHowl } from "@/lib/hooks/use-howl"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Music, MicOffIcon as MusicOff, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function WeddingInvitation() {
  const [isLocked, setIsLocked] = useState(true)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    opening: useRef<HTMLDivElement>(null),
    couple: useRef<HTMLDivElement>(null),
    akad: useRef<HTMLDivElement>(null),
    reception: useRef<HTMLDivElement>(null),
    closing: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    invitees: useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
  }

  // Setup music with react-howler
  const { howl, state } = useHowl({
    src: ["/music/Aku-Memilihmu.mp3"],
    html5: true,
    loop: true,
    volume: 0.5,
    preload: true,
  })

  // Handle invitation unlock
  const unlockInvitation = () => {
    setIsLocked(false)
    setIsMusicPlaying(true)

    // Scroll to opening section after animation completes
    setTimeout(() => {
      sectionRefs.opening.current?.scrollIntoView({ behavior: "smooth" })
    }, 1000)
  }

  // Toggle music
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying)
  }

  // Play/pause music based on state
  useEffect(() => {
    if (howl) {
      if (isMusicPlaying) {
        howl.play()
      } else {
        howl.pause()
      }
    }
  }, [isMusicPlaying, howl])

  // Intersection Observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id)
              }
            })
          },
          { threshold: 0.3 },
        )

        observer.observe(ref.current)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [isLocked])

  return (
    <div className="relative min-h-screen bg-black text-beige overflow-hidden font-serif">
      {/* Background pattern - Floral */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <Image src="/images/floral.jpg" alt="Floral Background" fill className="object-cover" />
      </div>

      {/* Music control button */}
      <AnimatePresence>
        {!isLocked && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1 }}
            onClick={toggleMusic}
            className="fixed bottom-6 right-6 z-50 bg-gold/80 text-black p-3 rounded-full shadow-lg hover:bg-gold transition-colors"
            aria-label={isMusicPlaying ? "Mute music" : "Play music"}
          >
            {isMusicPlaying ? <MusicOff size={20} /> : <Music size={20} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section (Locked Cover) */}
      <AnimatePresence>
        {isLocked ? (
          <motion.section
            ref={sectionRefs.hero}
            className="h-screen flex flex-col items-center justify-center relative z-10 px-4 sm:px-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-script text-6xl sm:text-7xl md:text-8xl text-gold mb-6">Irma & Rangga</h1>
              <p className="text-xl sm:text-2xl md:text-3xl mb-10 text-beige/90">Minggu, 15 Juni 2025</p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={unlockInvitation}
                  className="bg-gold hover:bg-gold/80 text-black font-medium px-8 py-6 rounded-md text-lg sm:text-xl"
                >
                  Lihat Undangan
                </Button>
              </motion.div>
            </motion.div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {/* Main Content (Revealed after unlock) */}
      <AnimatePresence>
        {!isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pb-20"
          >
            {/* Religious Opening */}
            <motion.section
              ref={sectionRefs.opening}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-3xl mx-auto text-center w-full">
                <h2 className="font-arabic text-4xl sm:text-5xl md:text-6xl text-gold mb-8">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
                <p className="text-xl sm:text-2xl md:text-3xl mb-8">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
                <motion.p
                  className="text-lg sm:text-xl text-beige/80 leading-relaxed max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri
                  kami:
                </motion.p>
              </div>
            </motion.section>

            {/* Intro: Mempelai */}
            <motion.section
              ref={sectionRefs.couple}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-5xl mx-auto w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold text-center mb-16">
                  Dengan memohon ridho Allah SWT...
                </h2>

                <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
                  {/* Bride */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gold/30">
                      <Image src="/images/irma.jpg" alt="Irma N." fill className="object-cover" />
                    </div>
                    <h3 className="font-script text-3xl sm:text-4xl text-gold mb-4">Irma N.</h3>
                    <p className="text-lg sm:text-xl mb-4">Putri dari</p>
                    <p className="text-xl sm:text-2xl mb-1">Bpk. Jajang Afendi</p>
                    <p className="text-xl sm:text-2xl">&</p>
                    <p className="text-xl sm:text-2xl">Ibu Dedeh Supriyati</p>
                  </motion.div>

                  {/* Groom */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gold/30">
                      <Image src="/images/rangga.jpg" alt="Rangga W." fill className="object-cover" />
                    </div>
                    <h3 className="font-script text-3xl sm:text-4xl text-gold mb-4">Rangga W.</h3>
                    <p className="text-lg sm:text-xl mb-4">Putra dari</p>
                    <p className="text-xl sm:text-2xl mb-1">Ibu Ati (Almh)/Ibu Rinawati S.Pd</p>
                    <p className="text-xl sm:text-2xl">&</p>
                    <p className="text-xl sm:text-2xl">Bpk. Juju (Alm)/Bpk. Nanang Suryana</p>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Akad Nikah */}
            <motion.section
              ref={sectionRefs.akad}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-4xl mx-auto text-center w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold mb-12">Akad Nikah</h2>

                <motion.div
                  className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 sm:p-8 mb-8 max-w-3xl mx-auto"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Calendar className="text-gold" size={28} />
                    <p className="text-xl sm:text-2xl">Minggu, 15 Juni 2025</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Clock className="text-gold" size={28} />
                    <p className="text-xl sm:text-2xl">Pukul 08.30 WIB</p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <MapPin className="text-gold flex-shrink-0" size={28} />
                    <p className="text-xl sm:text-2xl">
                      Villa D'LAFISHA, Kp. Cijagung, Gede Pangrango RT.27 RW.07 – Kab. Sukabumi
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Resepsi Pernikahan */}
            <motion.section
              ref={sectionRefs.reception}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-4xl mx-auto text-center w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold mb-12">Resepsi Pernikahan</h2>

                <motion.div
                  className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 sm:p-8 mb-12 max-w-3xl mx-auto"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Calendar className="text-gold" size={28} />
                    <p className="text-xl sm:text-2xl">Minggu, 15 Juni 2025</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Clock className="text-gold" size={28} />
                    <p className="text-xl sm:text-2xl">Pukul 10.00 WIB</p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <MapPin className="text-gold flex-shrink-0" size={28} />
                    <p className="text-xl sm:text-2xl">
                      Villa D'LAFISHA, Kp. Cijagung, Gede Pangrango RT.27 RW.07 – Kab. Sukabumi
                    </p>
                  </div>
                </motion.div>

                <motion.p
                  className="text-lg sm:text-xl text-beige/80 leading-relaxed mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk
                  memberikan doa restu kepada kedua mempelai.
                </motion.p>

                <p className="text-xl sm:text-2xl">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
              </div>
            </motion.section>

            {/* Ucapan Penutup Keluarga */}
            <motion.section
              ref={sectionRefs.closing}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-5xl mx-auto text-center w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold mb-16">Hormat Kami</h2>

                <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
                  {/* Bride's Family */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <h3 className="font-script text-2xl sm:text-3xl text-gold mb-6">Keluarga Irma</h3>
                    <p className="text-xl sm:text-2xl mb-2">Bpk. Jajang Afendi</p>
                    <p className="text-xl sm:text-2xl">&</p>
                    <p className="text-xl sm:text-2xl">Ibu Dedeh Supriyati</p>
                  </motion.div>

                  {/* Groom's Family */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <h3 className="font-script text-2xl sm:text-3xl text-gold mb-6">Keluarga Rangga</h3>
                    <p className="text-xl sm:text-2xl mb-2">Ibu Ati (Almh)/Ibu Rinawati S.Pd</p>
                    <p className="text-xl sm:text-2xl">&</p>
                    <p className="text-xl sm:text-2xl">Bpk. Juju (Alm)/Bpk. Nanang Suryana</p>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Galeri Foto - Now before Turut Mengundang */}
            <motion.section
              ref={sectionRefs.gallery}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-6xl mx-auto text-center w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold mb-12">Galeri Foto</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {[1, 2, 3].map((index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <motion.div
                          className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-lg"
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Image
                            src={`/images/prewed${index}.jpg`}
                            alt={`Pre-wedding photo ${index}`}
                            fill
                            className="object-cover transition-transform hover:scale-110 duration-700"
                          />
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-black/90 border-gold/30">
                        <div className="relative aspect-[3/4] w-full">
                          <Image
                            src={`/images/prewed${index}.jpg`}
                            alt={`Pre-wedding photo ${index}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Turut Mengundang - Now after Gallery */}
            <motion.section
              ref={sectionRefs.invitees}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-5xl mx-auto text-center w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold mb-12">Turut Mengundang</h2>

                <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                  {/* Female Side */}
                  <motion.div
                    className="bg-black/30 backdrop-blur-sm border border-gold/20 rounded-xl p-6 sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <h3 className="text-2xl sm:text-3xl text-gold mb-6">Pihak Perempuan</h3>
                    <ul className="space-y-3 text-lg sm:text-xl">
                      <li>H. Denny</li>
                      <li>AKP Didin Waslidin</li>
                      <li>Kanit Eka</li>
                      <li>Asep Badrutamam (Kades)</li>
                      <li>Ustadz Uju</li>
                    </ul>
                  </motion.div>

                  {/* Male Side */}
                  <motion.div
                    className="bg-black/30 backdrop-blur-sm border border-gold/20 rounded-xl p-6 sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <h3 className="text-2xl sm:text-3xl text-gold mb-6">Pihak Pria</h3>
                    <ul className="space-y-3 text-lg sm:text-xl">
                      <li>Wardi Sutandi (Kades)</li>
                      <li>Apad Padilah (Kadus)</li>
                      <li>Cecep Sanusi (BPD)</li>
                      <li>Ustadz Nendi</li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Lokasi */}
            <motion.section
              ref={sectionRefs.location}
              className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-5xl mx-auto text-center w-full">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold mb-12">Lokasi</h2>

                <motion.div
                  className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden mb-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="aspect-video w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d990.3372683568978!2d106.92355750297166!3d-6.84869206473916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTAnNTUuNSJTIDEwNsKwNTUnMjcuMCJF!5e0!3m2!1sid!2sid!4v1747634705114!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Wedding Location"
                    ></iframe>
                  </div>
                </motion.div>

                <Link
                  href="https://maps.app.goo.gl/CgUajWVn7cVtCrKi9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold/80 text-black font-medium px-6 py-4 rounded-md text-lg sm:text-xl transition-colors"
                >
                  <MapPin size={22} />
                  Buka di Google Maps
                  <ExternalLink size={18} />
                </Link>
              </div>
            </motion.section>

            {/* Footer */}
            <footer className="text-center py-10 border-t border-gold/20">
              <p className="font-script text-3xl sm:text-4xl text-gold mb-3">Irma & Rangga</p>
              <p className="text-xl text-beige/70">15 Juni 2025</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
