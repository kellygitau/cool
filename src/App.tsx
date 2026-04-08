import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Image as ImageIcon, 
  User, 
  MessageSquare, 
  Sparkles, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePoster } from "@/src/lib/gemini";

export default function App() {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [mpImage, setMpImage] = useState<string | null>(null);
  const [message, setMessage] = useState("Your Vote, Your Voice. Register Today!");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseInputRef = useRef<HTMLInputElement>(null);
  const mpInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!baseImage) {
      setError("Please upload the base poster image first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePoster(baseImage, mpImage, message);
      setGeneratedPoster(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate poster. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#F27D26] selection:text-black">
      {/* Hero Section */}
      <header className="relative h-[40vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
          <div className="grid grid-cols-8 h-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border-r border-white/5 h-full" />
            ))}
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#F27D26] font-bold mb-4 block">
            Youth Empowerment Initiative
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-4">
            Voter <br /> <span className="text-transparent border-text">Registration</span>
          </h1>
          <p className="text-sm text-white/50 max-w-md mx-auto font-medium">
            Professional poster generation for local leaders. Rework designs, integrate MP imagery, and mobilize the youth.
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Controls */}
          <section className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-px bg-[#F27D26]" />
                <h2 className="text-xs uppercase tracking-widest font-bold text-white/40">Configuration</h2>
              </div>

              <Tabs defaultValue="images" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 w-full justify-start p-1 h-auto mb-6">
                  <TabsTrigger value="images" className="data-[state=active]:bg-[#F27D26] data-[state=active]:text-black py-2 px-4 text-xs uppercase font-bold tracking-wider">
                    Assets
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-[#F27D26] data-[state=active]:text-black py-2 px-4 text-xs uppercase font-bold tracking-wider">
                    Message
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="space-y-6 mt-0">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Base Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest text-white/60">Base Poster</Label>
                      <div 
                        onClick={() => baseInputRef.current?.click()}
                        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group relative
                          ${baseImage ? 'border-[#F27D26]/50 bg-white/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                      >
                        {baseImage ? (
                          <>
                            <img src={baseImage} alt="Base" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <RefreshCw className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <ImageIcon className="w-6 h-6 text-white/40" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Upload Original</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={baseInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setBaseImage)}
                        />
                      </div>
                    </div>

                    {/* MP Image Upload */}
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest text-white/60">MP Integration</Label>
                      <div 
                        onClick={() => mpInputRef.current?.click()}
                        className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group relative
                          ${mpImage ? 'border-[#F27D26]/50 bg-white/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                      >
                        {mpImage ? (
                          <>
                            <img src={mpImage} alt="MP" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <RefreshCw className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <User className="w-6 h-6 text-white/40" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Upload MP Image</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={mpInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setMpImage)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest text-white/60">Campaign Message</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-[#F27D26] transition-colors min-h-[120px] resize-none"
                        placeholder="Enter the message for the youth..."
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !baseImage}
                className="w-full h-14 bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-black uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                )}
                {isGenerating ? "Reworking Design..." : "Generate Final Poster"}
              </Button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#F27D26]">Instructions Applied</h3>
              <ul className="space-y-3">
                {[
                  "Remove spade detail from the card",
                  "Integrate MP profile professionally",
                  "Optimize for youth engagement",
                  "High-resolution 1K output"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[11px] text-white/60 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F27D26]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Preview */}
          <section className="sticky top-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-[#F27D26]" />
              <h2 className="text-xs uppercase tracking-widest font-bold text-white/40">Live Preview</h2>
            </div>

            <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-[#0a0a0a] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {generatedPoster ? (
                      <motion.div
                        key="generated"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative group"
                      >
                        <img 
                          src={generatedPoster} 
                          alt="Generated Poster" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                          <Button 
                            asChild
                            className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-full"
                          >
                            <a href={generatedPoster} download="voter-registration-poster.png">
                              <Download className="w-3 h-3 mr-2" />
                              Download High-Res
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center p-12 text-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 relative">
                          <ImageIcon className="w-8 h-8 text-white/20" />
                          {isGenerating && (
                            <motion.div 
                              className="absolute inset-0 border-2 border-[#F27D26] rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
                          {isGenerating ? "AI is Reworking Design" : "Ready for Generation"}
                        </h3>
                        <p className="text-xs text-white/40 max-w-[240px] leading-relaxed">
                          {isGenerating 
                            ? "Applying your edits and integrating assets. This may take a few moments." 
                            : "Upload your base poster and MP image to see the reworked design here."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Visual Accents */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                  {isGenerating && (
                    <motion.div 
                      className="h-full bg-[#F27D26]"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#F27D26] flex items-center justify-center text-black font-black">
              VR
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest">Voter Registration Maker</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Powered by Gemini 3.1 Flash Image</p>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-[#F27D26] transition-colors">Privacy</a>
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-[#F27D26] transition-colors">Terms</a>
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-[#F27D26] transition-colors">Support</a>
          </div>
        </div>
      </footer>

      <style>{`
        .border-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
