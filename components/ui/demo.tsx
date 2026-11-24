import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-8 p-6">
       <div className="text-center space-y-1">
         <h2 className="text-xl font-bold tracking-tight">Curtain Theme Toggle</h2>
         <p className="text-sm opacity-60">Click the button to see the smooth curtain animation transition.</p>
       </div>
       
       {/* Icon Only Variant */}
       <div className="flex flex-col items-center gap-2">
         <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Icon Variant</span>
         <div className="bg-[#f3ede1] dark:bg-[#0e0e0e] p-6 rounded-2xl shadow-xl border border-black/5 dark:border-white/10 flex items-center justify-center transition-colors">
            <ThemeToggle variant="icon" defaultTheme="light" duration={550} />
         </div>
       </div>

       {/* Full AppBar Variant Preview */}
       <div className="w-full max-w-2xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg">
         <ThemeToggle 
           variant="appbar" 
           defaultTheme="light"
           duration={550}
           appBarProps={{
             appName: "Fard Vault",
             userName: "Security Admin",
             userAvatar: (
               <img 
                 src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                 alt="User Avatar"
                 className="w-8 h-8 rounded-full object-cover ring-2 ring-lime-400/40"
               />
             ),
             onSearch: (q) => console.log("Search query:", q)
           }}
         >
           <div className="p-8 text-center">
             <p className="text-sm font-medium">AppBar variant with custom logo, search, and user avatar.</p>
           </div>
         </ThemeToggle>
       </div>
    </div>
  );
}
