import { Navigation } from "@/components/Navigation";
import { LiquidChrome } from "@/components/LiquidChrome";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { usePosts } from "@/hooks/use-posts";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Hammer, Users, Instagram, ShoppingBag, MessageCircle, Heart } from "lucide-react";

export default function Home() {
  const { data: posts, isLoading } = usePosts();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground selection:bg-accent/20">
      <Navigation />
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 w-full h-full -z-10">
          <LiquidChrome
            baseColor={[0.1, 0.1, 0.1]}
            speed={1}
            amplitude={0.6}
            interactive={true}
          />
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center max-w-5xl mx-auto space-y-12"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-[18vw] md:text-[14rem] leading-[0.75] font-display font-black tracking-tighter chrome-text"
          >
            TENZO
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-3xl font-light text-white/70 max-w-2xl mx-auto text-balance leading-tight"
          >
            Essential Living. Curated for the modern Indian.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="pt-8">
            <a 
              href="https://instagram.com" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <span>Join the Community</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground/50 animate-bounce"
        >
          <div className="w-[1px] h-12 bg-current mx-auto mb-2" />
          <span className="text-xs uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* 2. WHAT WE DO */}
      <section id="build" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          <FeatureCard 
            icon={<Leaf className="w-8 h-8 text-primary" />}
            title="Curate"
            description="We select only the essential tools and objects that bring clarity to your workspace and life."
          />
          <FeatureCard 
            icon={<Hammer className="w-8 h-8 text-primary" />}
            title="Build"
            description="Crafting digital and physical environments that foster focus, creativity, and deep work."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-primary" />}
            title="Connect"
            description="A growing community of like-minded individuals seeking balance in a chaotic world."
          />
        </motion.div>
      </section>

      {/* 3. QUICK LINKS */}
      <section id="connect" className="py-24 bg-white/40 backdrop-blur-sm border-y border-white/50">
        <div className="max-w-3xl mx-auto px-6 space-y-6 text-center">
          <h2 className="text-3xl font-display font-semibold mb-12">Connect With Us</h2>
          
          <div className="space-y-4">
            <LinkTreeButton 
              href="#" 
              icon={<Instagram className="w-5 h-5" />} 
              label="Follow on Instagram" 
              sublabel="@tenzo.official"
            />
            <LinkTreeButton 
              href="#" 
              icon={<MessageCircle className="w-5 h-5" />} 
              label="Join WhatsApp Channel" 
              sublabel="Daily inspiration & updates"
            />
            <LinkTreeButton 
              href="#" 
              icon={<ShoppingBag className="w-5 h-5" />} 
              label="Amazon Finds" 
              sublabel="Curated essentials for your desk"
            />
          </div>
        </div>
      </section>

      {/* 4. BLOG SECTION */}
      <section id="journal" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">The Journal</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold">Latest Stories</h2>
          </div>
          <CreatePostDialog />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 px-6 border-t border-primary/10 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-display font-bold tracking-tighter">TENZO</span>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Tenzo Living. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components for clean file structure

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="p-8 rounded-3xl bg-white/40 hover:bg-white/70 transition-colors duration-300 border border-white/60 shadow-sm hover:shadow-md"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F2F0EB] flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-light">{description}</p>
    </motion.div>
  );
}

function LinkTreeButton({ href, icon, label, sublabel }: { href: string, icon: React.ReactNode, label: string, sublabel: string }) {
  return (
    <a 
      href={href}
      className="group flex items-center justify-between p-4 px-6 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-semibold text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{sublabel}</div>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  );
}

function ArticleCard({ post }: { post: any }) {
  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-primary/10"
    >
      <div className="relative h-64 overflow-hidden">
        {post.imageUrl ? (
          <>
            {/* Descriptive comment for Unsplash URL would go here in data */}
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </>
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full uppercase tracking-wider text-primary shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-8 flex flex-col">
        <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 mb-6 font-light flex-1">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
          </span>
          <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-accent transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
