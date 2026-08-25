'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Store, 
  Stethoscope, 
  MessageSquare, 
  Sun, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  ChevronDown, 
  Leaf, 
  LogIn, 
  UserPlus, 
  Check, 
  Wheat, 
  MapPin, 
  Radio, 
  ArrowUpRight,
  Award,
  Zap,
  HelpCircle,
  Clock,
  CloudSun
} from 'lucide-react';

interface WelcomeContent {
  badge: string;
  tagline: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  desc: string;
  guideHeading: string;
  guideSubheading: string;
  newHereTag: string;
  newHereTitle: string;
  newHereSubtitle: string;
  newHereDesc: string;
  newHereBtn: string;
  newHereFooter: string;
  newHerePoints: string[];
  existingUserTag: string;
  existingUserTitle: string;
  existingUserSubtitle: string;
  existingUserDesc: string;
  existingUserBtn: string;
  existingUserFooter: string;
  existingUserPoints: string[];
  stats: { label: string; value: string; subtext: string; icon: any }[];
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: {
    mandi: { title: string; tag: string; desc: string; highlights: string[]; actionText: string };
    ai: { title: string; tag: string; desc: string; highlights: string[]; actionText: string };
    charcha: { title: string; tag: string; desc: string; highlights: string[]; actionText: string };
    weather: { title: string; tag: string; desc: string; highlights: string[]; actionText: string };
  };
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: { quote: string; author: string; location: string; crop: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
}

export default function WelcomeGuidePage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'mandi' | 'ai' | 'charcha' | 'weather'>('mandi');

  const content: Record<'en' | 'hi', WelcomeContent> = {
    en: {
      badge: "India's #1 Digital Agricultural Platform • 50,000+ Farmers",
      tagline: "खेती का नया दौर, किसानों का अपना मंच",
      titleStart: "Grow Smarter.",
      titleHighlight: "Real-time Mandi Rates.",
      titleEnd: "Harvest Together.",
      desc: "KrishiSocial connects progressive farmers with real-time APMC wholesale prices, instant AI leaf disease diagnosis, live expert voice discussions, and hyperlocal weather alerts.",
      
      guideHeading: "How would you like to get started?",
      guideSubheading: "Choose an option below to continue to your customized farm experience",
      
      newHereTag: "Recommended for New Farmers",
      newHereTitle: "New to KrishiSocial?",
      newHereSubtitle: "Create your farm profile in 30 seconds",
      newHereDesc: "Join thousands of farmers across 18 states. Get free personalized crop advisory, daily mandi rates, and instant pest detection.",
      newHereBtn: "Create Free Account",
      newHereFooter: "100% Free Forever • Zero Subscription Fees • Instant Setup",
      newHerePoints: [
        "Instant AI Crop Disease Scanner & scientific cures",
        "Live APMC Mandi rates across 450+ wholesale markets",
        "Join 24/7 Kisan Charcha & expert voice audio rooms",
        "Hyperlocal weather forecast & best spray-window alerts"
      ],

      existingUserTag: "Returning Members",
      existingUserTitle: "Already Have an Account?",
      existingUserSubtitle: "Welcome back, Kisan Mitr!",
      existingUserDesc: "Sign in to access your saved crop bookmarks, market price alerts, active forum questions, and farming community discussions.",
      existingUserBtn: "Sign In to Your Account",
      existingUserFooter: "Fast, encrypted and secure authentication",
      existingUserPoints: [
        "Track price trends for your bookmarked crops",
        "Check replies to your farm questions",
        "Access your historical AI crop disease diagnoses",
        "Connect with local mandi buyers and farmers"
      ],

      stats: [
        { label: "Active Farmers", value: "50,000+", subtext: "Across 18 states", icon: Users },
        { label: "APMC Mandis", value: "450+", subtext: "Real-time daily bhav", icon: Store },
        { label: "AI Doctor Accuracy", value: "98.4%", subtext: "RAG-powered model", icon: Stethoscope },
        { label: "Cost for Farmers", value: "100% Free", subtext: "Zero subscription fees", icon: ShieldCheck },
      ],

      featuresSectionTitle: "Explore the 4 Pillars of KrishiSocial",
      featuresSectionSubtitle: "Designed specifically to solve everyday challenges for Indian agriculture",
      
      features: {
        mandi: {
          title: "Real-time APMC Mandi Rates",
          tag: "Market Intelligence",
          desc: "Compare daily wholesale prices across 450+ APMC mandis before you sell your produce. Track arrival volumes and 7-day price trends.",
          highlights: ["450+ Mandis Live", "7-Day Price Forecasts", "Compare District Prices"],
          actionText: "View Live Mandi Rates"
        },
        ai: {
          title: "AI Crop Disease Doctor (RAG)",
          tag: "Artificial Intelligence",
          desc: "Take a photo of infected leaves or stems. Our AI immediately identifies the disease, causative pathogen, and recommends scientifically verified organic & chemical treatments.",
          highlights: ["Under 3 Seconds Diagnosis", "Organic & Chemical Remedies", "Pest Prevention Schedules"],
          actionText: "Try AI Crop Doctor"
        },
        charcha: {
          title: "Kisan Charcha & Voice Rooms",
          tag: "Farmer Community",
          desc: "Ask questions, share real field photos, and join live audio rooms with senior agronomy scientists and experienced progressive farmers.",
          highlights: ["24/7 Active Forums", "Live Voice Charcha", "Agronomist Verified Answers"],
          actionText: "Join Community Charcha"
        },
        weather: {
          title: "Hyperlocal Weather & Sowing Alerts",
          tag: "Smart Forecasts",
          desc: "Get hour-by-hour rain probability, humidity, wind speeds, and pesticide spraying suitability index tailored for your exact village or block.",
          highlights: ["Village-level Accuracy", "Pesticide Spray Windows", "Extreme Weather Warnings"],
          actionText: "Check Weather Forecast"
        }
      },

      testimonialsTitle: "Trusted by Farmers Across India",
      testimonialsSubtitle: "See how KrishiSocial is helping farmers maximize profits and protect crops",
      testimonials: [
        {
          quote: "Using Mandi Bhav on KrishiSocial, I checked rates in nearby 3 districts and sold my soybean at ₹4,850/Q instead of local ₹4,400. Earned ₹36,000 extra!",
          author: "Rajeshwar Patil",
          location: "Indore, Madhya Pradesh",
          crop: "Soybean & Wheat (14 Acres)"
        },
        {
          quote: "My tomato crop was turning black with blight. I scanned the leaf with the AI Doctor and applied the exact recommended organic fungicide. Saved 80% of my harvest.",
          author: "Gurpreet Singh",
          location: "Ludhiana, Punjab",
          crop: "Tomato & Potato (8 Acres)"
        },
        {
          quote: "The audio voice rooms in Kisan Charcha connected me directly with a scientist who gave me the perfect drip irrigation schedule for my cotton crop.",
          author: "Rameshwar Deshmukh",
          location: "Akola, Maharashtra",
          crop: "Cotton & Pulses (12 Acres)"
        }
      ],

      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "Is KrishiSocial completely free to use?",
          a: "Yes! KrishiSocial is 100% free for all farmers. You get full access to live APMC Mandi rates, AI Crop Doctor disease diagnoses, Kisan Charcha forums, and weather alerts at zero cost."
        },
        {
          q: "How accurate is the AI Crop Disease Doctor?",
          a: "Our AI Doctor is powered by Retrieval-Augmented Generation (RAG) trained on verified agricultural university research papers. It achieves over 98.4% diagnostic accuracy across major Indian crops including Wheat, Rice, Cotton, Soybean, Tomato, and Mustard."
        },
        {
          q: "Can I check mandi prices from other districts or states?",
          a: "Absolutely. You can search, filter, and compare wholesale prices from over 450+ APMC mandis across India to get the best deal for your produce."
        },
        {
          q: "How do I register for a new account?",
          a: "Click on 'Create Free Account' above, enter your name, username, email, and password. It takes less than 30 seconds and your account is active immediately."
        }
      ]
    },

    hi: {
      badge: "भारत का #1 डिजिटल कृषि व किसान मंच • 50,000+ किसान",
      tagline: "खेती का नया दौर, किसानों का अपना मंच",
      titleStart: "स्मार्ट खेती।",
      titleHighlight: "ताजा मंडी भाव।",
      titleEnd: "अधिक मुनाफा।",
      desc: "कृषि सोशल देश भर के किसानों को लाइव APMC मंडी भावों, AI फसल रोग जांच, विशेषज्ञ कृषि ऑडियो चर्चा और सटीक मौसम पूर्वानुमान से जोड़ता है।",
      
      guideHeading: "आप किस प्रकार शुरू करना चाहते हैं?",
      guideSubheading: "अपनी आवश्यकतानुसार नीचे दिए गए विकल्प का चयन करें",
      
      newHereTag: "नए किसानों के लिए विशेष",
      newHereTitle: "कृषि सोशल पर पहली बार आए हैं?",
      newHereSubtitle: "सिर्फ 30 सेकंड में अपना निःशुल्क खाता बनाएं",
      newHereDesc: "18 राज्यों के 50,000+ किसानों से जुड़ें। मुफ्त AI फसल डॉक्टर, दैनिक मंडी भाव, और मौसम आधारित छिड़काव सलाह तुरंत पाएं।",
      newHereBtn: "निःशुल्क खाता बनाएं (Register)",
      newHereFooter: "हमेशा 100% मुफ़्त • कोई छुपा शुल्क नहीं • तुरंत चालू",
      newHerePoints: [
        "पत्ते की फोटो से तुरंत AI फसल रोग जांच व सटीक इलाज",
        "450+ APMC मंडियों के प्रतिदिन के लाइव थोक भाव",
        "24/7 किसान चर्चा व वैज्ञानिकों के साथ लाइव ऑडियो कॉल",
        "पिनकोड आधारित बारिश व कीटनाशक छिड़काव का सही समय"
      ],

      existingUserTag: "पहले से पंजीकृत सदस्य",
      existingUserTitle: "क्या आपका पहले से खाता है?",
      existingUserSubtitle: "नमस्ते किसान मित्र, स्वागत है!",
      existingUserDesc: "अपने पसंदीदा मंडी भाव, पूछे गए सवालों के जवाब, फसल रोग इतिहास और समुदाय चर्चा में भाग लेने के लिए लॉगिन करें।",
      existingUserBtn: "खाते में लॉगिन करें (Sign In)",
      existingUserFooter: "सुरक्षित, गोपनीय और त्वरित प्रवेश",
      existingUserPoints: [
        "अपनी पसंदीदा फसलों के भाव में उतार-चढ़ाव देखें",
        "अपने सवालों पर आए कृषि सलाहकारों के उत्तर पढ़ें",
        "पुरानी AI रोग जांच रिपोर्ट और उपचार उपाय देखें",
        "पास के व्यापारियों और साथी किसानों से संपर्क करें"
      ],

      stats: [
        { label: "सक्रिय किसान मित्र", value: "50,000+", subtext: "18 राज्यों से जुड़े", icon: Users },
        { label: "APMC मंडियां", value: "450+", subtext: "दैनिक लाइव आंकड़े", icon: Store },
        { label: "AI रोग पहचान सटीकता", value: "98.4%", subtext: "RAG आधारित मॉडल", icon: Stethoscope },
        { label: "किसानों के लिए शुल्क", value: "100% मुफ़्त", subtext: "आजीवन कोई फीस नहीं", icon: ShieldCheck },
      ],

      featuresSectionTitle: "कृषि सोशल की 4 मुख्य सुविधाएं",
      featuresSectionSubtitle: "भारतीय किसानों की हर दैनिक समस्या का आधुनिक और वैज्ञानिक समाधान",

      features: {
        mandi: {
          title: "दैनिक APMC मंडी भाव",
          tag: "बाजार भाव",
          desc: "फसल बेचने से पहले 450+ मंडियों के लाइव थोक भाव देखें और तुलना करें। पिछले 7 दिनों का मूल्य रुझान और आवक की जानकारी पाएं।",
          highlights: ["450+ मंडियां लाइव", "7 दिन का भाव अनुमान", "जिलों के भाव की तुलना"],
          actionText: "लाइव मंडी भाव देखें"
        },
        ai: {
          title: "AI फसल डॉक्टर (RAG तकनीक)",
          tag: "कृत्रिम बुद्धिमत्ता",
          desc: "रोगग्रस्त पत्ते या तने की फोटो खींचें। AI तुरंत बीमारी का सटीक नाम, जीवाणु/फंगस और जैविक व रासायनिक उपचार बताता है।",
          highlights: ["3 सेकंड में रिपोर्ट", "जैविक व रासायनिक इलाज", "कीट रोकथाम कैलेंडर"],
          actionText: "AI फसल डॉक्टर आजमाएं"
        },
        charcha: {
          title: "किसान चर्चा व लाइव ऑडियो",
          tag: "किसान समुदाय",
          desc: "अपने खेत की समस्याएं साझा करें, फोटो अपलोड करें और कृषि वैज्ञानिकों व अनुभवी प्रगतिशील किसानों के साथ लाइव आवाज में चर्चा करें।",
          highlights: ["24/7 सक्रिय मंच", "लाइव ऑडियो चर्चा", "कृषि वैज्ञानिक द्वारा प्रमाणित उत्तर"],
          actionText: "किसान चर्चा में शामिल हों"
        },
        weather: {
          title: "सटीक मौसम व छिड़काव सलाह",
          tag: "मौसम पूर्वानुमान",
          desc: "अपने गांव के अनुसार प्रति घंटे बारिश की संभावना, तापमान, नमी और कीटनाशक छिड़काव के लिए सबसे उपयुक्त समय की जानकारी प्राप्त करें।",
          highlights: ["गांव स्तर की सटीकता", "छिड़काव का सही समय", "मौसम चेतावनी अलर्ट"],
          actionText: "मौसम पूर्वानुमान देखें"
        }
      },

      testimonialsTitle: "देश भर के किसानों का अटूट भरोसा",
      testimonialsSubtitle: "जानें कैसे कृषि सोशल किसानों की उपज और मुनाफे को बढ़ाने में मददगार साबित हुआ",
      testimonials: [
        {
          quote: "कृषि सोशल पर आसपास की मंडियों के भाव देखकर मैंने अपना सोयाबीन ₹4,850/क्विंटल पर बेचा, जबकि स्थानीय व्यापारी ₹4,400 दे रहा था। मुझे ₹36,000 का अतिरिक्त लाभ हुआ!",
          author: "राजेश्वर पाटिल",
          location: "इंदौर, मध्य प्रदेश",
          crop: "सोयाबीन व गेहूं (14 एकड़)"
        },
        {
          quote: "मेरे टमाटर के पत्तों पर काला धब्बा रोग लग गया था। AI डॉक्टर से तुरंत पत्ते की जांच की और बताई गई जैविक दवा छिड़की। मेरी 80% फसल बर्बाद होने से बच गई।",
          author: "गुरप्रीत सिंह",
          location: "लुधियाना, पंजाब",
          crop: "टमाटर व आलू (8 एकड़)"
        },
        {
          quote: "किसान चर्चा के लाइव ऑडियो रूम में मुझे सीधे कृषि वैज्ञानिक से बात करने का मौका मिला, जिन्होंने मेरी कपास की फसल के लिए ड्रिप सिंचाई का सही समय बताया।",
          author: "रामेश्वर देशमुख",
          location: "अकोला, महाराष्ट्र",
          crop: "कपास व दलहन (12 एकड़)"
        }
      ],

      faqTitle: "अक्सर पूछे जाने वाले सवाल (FAQ)",
      faqs: [
        {
          q: "क्या कृषि सोशल का उपयोग पूरी तरह मुफ़्त है?",
          a: "हाँ! कृषि सोशल सभी किसान भाइयों के लिए 100% मुफ़्त है। मंडी भाव, AI फसल डॉक्टर, किसान चर्चा और मौसम की जानकारी के लिए कोई शुल्क नहीं लिया जाता।"
        },
        {
          q: "AI फसल डॉक्टर कितना सटीक है?",
          a: "हमारा AI डॉक्टर भारतीय कृषि विश्वविद्यालयों के शोध पत्रों और वैज्ञानिक डेटा पर प्रशिक्षित है। यह गेहूं, धान, कपास, सोयाबीन, टमाटर, सरसों आदि फसलों पर 98.4% से अधिक सटीकता प्रदान करता है।"
        },
        {
          q: "क्या मैं दूसरे जिले या राज्य की मंडी का भाव देख सकता हूँ?",
          a: "जी हाँ, आप देश की 450+ मंडियों के भाव कभी भी खोज सकते हैं और तुलना करके अपनी फसल को सबसे सही दाम पर बेच सकते हैं।"
        },
        {
          q: "नया खाता कैसे बनाएं?",
          a: "ऊपर 'निःशुल्क खाता बनाएं' पर क्लिक करें, अपना नाम, यूजरनेम, ईमेल और पासवर्ड दर्ज करें। 30 सेकंड में आपका खाता तैयार हो जाएगा।"
        }
      ]
    }
  };

  const t = content[lang];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F3FAF3] text-slate-900 relative overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 font-sans pb-24 md:pb-12">
      
      {/* -------------------------------------------------------------
          BRIGHT, LUSH GRASSY & SUNLIT ATMOSPHERIC MEADOW BACKGROUND
      ------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Morning Sunbeam Golden Flare (Top Right) */}
        <div className="absolute -top-24 -right-24 w-[700px] h-[700px] bg-gradient-to-bl from-amber-300/30 via-yellow-200/20 to-transparent rounded-full blur-[130px]" />
        
        {/* Fresh Sky to Emerald Mist (Top Center) */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-emerald-200/40 via-teal-100/30 to-transparent rounded-full blur-[140px]" />
        
        {/* Left Meadow Ambient Tint */}
        <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-[140px]" />

        {/* Delicate Organic Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `radial-gradient(#15803D 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px'
          }} 
        />

        {/* Dynamic Multi-layered Grass & Meadow Silhouette Layers at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-[460px] overflow-hidden opacity-95">
          
          {/* Layer 1: Back Rolling Green Hills (Soft Sage Emerald) */}
          <svg className="absolute bottom-0 w-full h-80 text-[#D1EBD1]/80" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,133.3C672,128,768,160,864,186.7C960,213,1056,235,1152,224C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>

          {/* Layer 2: Mid Lush Grass Meadow (Vibrant Field Green) */}
          <svg className="absolute bottom-0 w-full h-56 text-[#A3D9A5]/90" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,96L60,112C120,128,240,160,360,154.7C480,149,600,107,720,117.3C840,128,960,192,1080,197.3C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>

          {/* Layer 3: Foreground Grass Blades & Stalks (Fresh Organic Forest Green) */}
          <svg className="absolute bottom-0 w-full h-36 text-[#2D7738]" viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,64L30,69.3C60,75,120,85,180,106.7C240,128,300,160,360,154.7C420,149,480,107,540,96C600,85,660,107,720,122.7C780,139,840,149,900,138.7C960,128,1020,96,1080,90.7C1140,85,1200,107,1260,117.3C1320,128,1380,128,1410,128L1440,128L1440,180L1410,180C1380,180,1320,180,1260,180C1200,180,1140,180,1080,180C1020,180,960,180,900,180C840,180,780,180,720,180C660,180,600,180,540,180C480,180,420,180,360,180C300,180,240,180,180,180C120,180,60,180,30,180L0,180Z"></path>
          </svg>

          {/* Micro Grass Blades Vector Pattern */}
          <div 
            className="absolute bottom-0 inset-x-0 h-20 opacity-40" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='36' viewBox='0 0 80 36'%3E%3Cpath d='M10,36 Q14,14 22,6 Q18,20 25,36 M32,36 Q36,12 45,2 Q40,18 48,36 M56,36 Q58,16 66,8 Q63,22 72,36' stroke='%2315803D' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'bottom'
            }}
          />
        </div>
      </div>

      {/* -------------------------------------------------------------
          TOP FLOATING NAVIGATION BAR (CLEAN FROSTED GLASS)
      ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-200/70 bg-white/85 backdrop-blur-2xl transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/welcome" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#1B5E20] via-[#2E7D32] to-[#43A047] flex items-center justify-center text-white shadow-md shadow-green-900/20 group-hover:scale-105 transition-transform duration-300">
              <Sprout size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-0.5">
                Krishi<span className="text-[#2E7D32]">Social</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-emerald-800/80 -mt-1">
                Kisan Community & Mandi AI
              </span>
            </div>
          </Link>

          {/* Language & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Language Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-black shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-[#2E7D32] text-white shadow-sm font-black' 
                    : 'text-emerald-800 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  lang === 'hi' 
                    ? 'bg-[#2E7D32] text-white shadow-sm font-black' 
                    : 'text-emerald-800 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Header Login CTA */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs uppercase tracking-wider border border-emerald-200 shadow-xs transition-all active:scale-95"
            >
              <LogIn size={15} className="text-[#2E7D32]" />
              <span>{lang === 'en' ? 'Sign In' : 'लॉगिन'}</span>
            </Link>

            {/* Header Register Primary CTA */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#43A047] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-green-900/20 transition-all active:scale-95"
            >
              <UserPlus size={15} strokeWidth={2.5} />
              <span className="hidden xs:inline">{lang === 'en' ? 'Register Free' : 'खाता बनाएं'}</span>
              <span className="xs:hidden">{lang === 'en' ? 'Join' : 'जुड़ें'}</span>
            </Link>

          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          HERO & LIVE AGRICULTURAL TICKER
      ------------------------------------------------------------- */}
      <section className="relative z-10 pt-8 sm:pt-14 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Pill */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-extrabold shadow-xs backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-500">
            <Leaf size={15} className="text-[#2E7D32] shrink-0 animate-bounce" />
            <span>{t.badge}</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
            {t.titleStart}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#10B981]">
              {t.titleHighlight}
            </span>{' '}
            {t.titleEnd}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Live Agricultural Market Ticker Bar */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/90 border border-emerald-200/90 backdrop-blur-xl shadow-lg shadow-emerald-950/5 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider shrink-0 border border-emerald-300/70">
              <Radio size={12} className="text-[#2E7D32] animate-pulse" />
              <span>Live Updates</span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 text-xs font-bold text-slate-700 whitespace-nowrap min-w-max">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">🌾 Wheat (Indore):</span>
                <span className="text-slate-900 font-black">₹2,480/Q</span>
                <span className="text-emerald-700 text-[11px] font-extrabold flex items-center">↑ +₹65</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">🌿 Soybean (Kota):</span>
                <span className="text-slate-900 font-black">₹4,720/Q</span>
                <span className="text-emerald-700 text-[11px] font-extrabold flex items-center">↑ +₹110</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">🔬 AI Doctor:</span>
                <span className="text-slate-900 font-black">4,200+ Scans today</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">☀️ Weather:</span>
                <span className="text-amber-700 font-black">Spray window open in MP & UP</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------------------
          THE CORE GUIDE: DUAL DECISION CENTER (REGISTER VS LOGIN)
      ------------------------------------------------------------- */}
      <section className="relative z-10 py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
            {t.guideHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            {t.guideSubheading}
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* ==========================================================
              CARD 1: NEW TO KRISHISOCIAL (HERO GREEN CARD)
          ========================================================== */}
          <div className="relative group rounded-[36px] p-7 sm:p-10 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#15803D] text-white border-2 border-emerald-400 shadow-2xl shadow-green-950/20 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
            
            {/* Top Golden Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-300 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-widest px-5 py-2 rounded-bl-3xl shadow-md flex items-center gap-1.5">
              <Sparkles size={13} className="text-slate-950" />
              <span>{t.newHereTag}</span>
            </div>

            {/* Subtle Watermark Leaves */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 pt-3 relative z-10">
              {/* Icon & Title */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-white text-[#1B5E20] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <UserPlus size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {t.newHereTitle}
                  </h3>
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mt-0.5">
                    {t.newHereSubtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-emerald-50 font-medium leading-relaxed">
                {t.newHereDesc}
              </p>

              {/* Value Checkpoints Checklist */}
              <div className="space-y-3 pt-4 border-t border-white/20">
                {t.newHerePoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-white">
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 relative z-10 space-y-3">
              <Link
                href="/register"
                className="w-full h-15 bg-white hover:bg-emerald-50 text-[#1B5E20] rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{t.newHereBtn}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <p className="text-[11px] text-center text-emerald-100 font-bold">
                {t.newHereFooter}
              </p>
            </div>

          </div>

          {/* ==========================================================
              CARD 2: ALREADY A MEMBER (CRISP WHITE CARD)
          ========================================================== */}
          <div className="relative group rounded-[36px] p-7 sm:p-10 bg-white text-slate-900 border-2 border-emerald-200 hover:border-[#2E7D32] shadow-2xl shadow-emerald-950/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
            
            {/* Top Ribbon Tag */}
            <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-900 text-[10px] sm:text-xs font-black uppercase tracking-widest px-5 py-2 rounded-bl-3xl border-l border-b border-emerald-200">
              <span>{t.existingUserTag}</span>
            </div>

            <div className="space-y-6 pt-3 relative z-10">
              {/* Icon & Title */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#2E7D32] border border-emerald-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-300 shadow-md shrink-0">
                  <LogIn size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    {t.existingUserTitle}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                    {t.existingUserSubtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {t.existingUserDesc}
              </p>

              {/* Value Checkpoints Checklist */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {t.existingUserPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 relative z-10 space-y-3">
              <Link
                href="/login"
                className="w-full h-15 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#15803D] hover:to-[#1B5E20] text-white rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-green-900/20"
              >
                <span>{t.existingUserBtn}</span>
                <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <p className="text-[11px] text-center text-slate-500 font-bold">
                {t.existingUserFooter}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* -------------------------------------------------------------
          KEY STATS BANNER
      ------------------------------------------------------------- */}
      <section className="relative z-10 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-[32px] bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5">
          {t.stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-3 border border-emerald-200">
                  <Icon size={24} />
                </div>
                <span className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm font-black text-[#2E7D32] uppercase tracking-wider mt-1">{stat.label}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.subtext}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------
          INTERACTIVE 4 PILLARS FEATURE SHOWCASE
      ------------------------------------------------------------- */}
      <section className="relative z-10 py-12 sm:py-18 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.featuresSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-xl mx-auto">
            {t.featuresSectionSubtitle}
          </p>
        </div>

        {/* Feature Tabs Selector */}
        <div className="flex justify-center mb-8 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-2 p-1.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
            <button
              onClick={() => setActiveFeatureTab('mandi')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFeatureTab === 'mandi'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store size={16} />
              <span>{lang === 'en' ? 'Mandi Bhav' : 'मंडी भाव'}</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('ai')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFeatureTab === 'ai'
                  ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={16} />
              <span>{lang === 'en' ? 'AI Doctor' : 'AI फसल डॉक्टर'}</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('charcha')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFeatureTab === 'charcha'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={16} />
              <span>{lang === 'en' ? 'Kisan Charcha' : 'किसान चर्चा'}</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('weather')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeFeatureTab === 'weather'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun size={16} />
              <span>{lang === 'en' ? 'Weather' : 'मौसम सलाह'}</span>
            </button>
          </div>
        </div>

        {/* Feature Detail Showcase Card */}
        {(() => {
          const feat = t.features[activeFeatureTab];
          return (
            <div className="rounded-[36px] p-6 sm:p-10 bg-white border border-emerald-100 shadow-2xl shadow-emerald-950/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Info Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#2E7D32] text-xs font-black uppercase tracking-wider border border-emerald-200">
                  <Sparkles size={13} />
                  <span>{feat.tag}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
                  {feat.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {feat.desc}
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Register/Login Quick Action */}
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#43A047] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-green-900/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>{lang === 'en' ? 'Get Access - Register Free' : 'मुफ़्त खाता बनाकर उपयोग करें'}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/login"
                    className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                  >
                    <span>{lang === 'en' ? 'Sign In' : 'लॉगिन करें'}</span>
                  </Link>
                </div>
              </div>

              {/* Right Visual Simulation Column */}
              <div className="lg:col-span-5 bg-[#F8FCF8] p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-inner">
                {activeFeatureTab === 'mandi' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-700">Live APMC Mandi Rates</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Today</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-2xl bg-white border border-emerald-100 flex justify-between items-center text-xs shadow-xs">
                        <div>
                          <p className="font-black text-slate-900">Wheat (गेहूं) - Sharbati</p>
                          <p className="text-[10px] text-slate-500">Indore Mandi • 1,200 Bags</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-700">₹2,480/Q</p>
                          <p className="text-[10px] text-emerald-600 font-bold">+₹65 (↑2.6%)</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white border border-emerald-100 flex justify-between items-center text-xs shadow-xs">
                        <div>
                          <p className="font-black text-slate-900">Soybean (सोयाबीन) - Yellow</p>
                          <p className="text-[10px] text-slate-500">Kota Mandi • 850 Bags</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-700">₹4,720/Q</p>
                          <p className="text-[10px] text-emerald-600 font-bold">+₹110 (↑2.4%)</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white border border-emerald-100 flex justify-between items-center text-xs shadow-xs">
                        <div>
                          <p className="font-black text-slate-900">Cotton (कपास) - Medium</p>
                          <p className="text-[10px] text-slate-500">Rajkot Mandi • 2,100 Bales</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-700">₹7,250/Q</p>
                          <p className="text-[10px] text-emerald-600 font-bold">+₹140 (↑1.9%)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'ai' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-800">AI Diagnostic Report</span>
                      <span className="text-[10px] bg-[#2E7D32] text-white px-2 py-0.5 rounded-full font-black">98.4% Confidence</span>
                    </div>
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                        <Stethoscope size={16} className="text-[#2E7D32]" />
                        <span>Detected: Tomato Early Blight (Alternaria solani)</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Target spot lesions on lower leaves. Immediate preventative treatment recommended.
                      </p>
                      <div className="p-2.5 bg-white rounded-xl text-[10px] text-slate-700 space-y-1 border border-emerald-100">
                        <p className="font-bold text-amber-800">🌿 Recommended Treatment:</p>
                        <p>1. Spray Mancozeb 75% WP (2.5g/L water) OR Trichoderma viride (organic).</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'charcha' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-700">Active Kisan Charcha</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">14 Active in Room</span>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-blue-100 space-y-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          DS
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">Dr. D. Sharma (Agronomist)</p>
                          <p className="text-[10px] text-slate-500">Live Voice Charcha: Rabi Sowing Tips</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">
                        "For late sowing wheat varieties like PBW 550, ensure seed treatment with Azotobacter to boost root vigor."
                      </p>
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'weather' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-amber-100">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800">Agricultural Weather</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Hyperlocal</span>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-white to-emerald-50 rounded-2xl border border-emerald-200 space-y-3 shadow-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-3xl font-black text-slate-900">28°C</p>
                          <p className="text-xs text-emerald-800 font-bold">Clear Sky • Bhopal, MP</p>
                        </div>
                        <Sun size={36} className="text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-emerald-100">
                        <div>
                          <span className="text-slate-500">Rain Chance:</span>
                          <span className="font-bold text-slate-900 ml-1">10%</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Wind:</span>
                          <span className="font-bold text-slate-900 ml-1">8 km/h</span>
                        </div>
                        <div className="col-span-2 p-2 bg-emerald-100/70 rounded-xl text-emerald-900 text-[10px] font-bold">
                          ✓ Spraying Condition: Highly Favorable today (3 PM - 6 PM)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })()}

      </section>

      {/* -------------------------------------------------------------
          FARMER SUCCESS STORIES & TESTIMONIALS
      ------------------------------------------------------------- */}
      <section className="relative z-10 py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.testimonialsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.testimonials.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-7 rounded-[32px] bg-white border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4 shadow-lg shadow-emerald-950/5"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs">
                  {item.author[0]}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 truncate">{item.author}</h4>
                  <p className="text-[10px] text-emerald-700 font-bold truncate flex items-center gap-1">
                    <MapPin size={10} /> {item.location}
                  </p>
                  <p className="text-[9px] text-slate-500 font-medium truncate">{item.crop}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* -------------------------------------------------------------
          FAQ ACCORDION SECTION
      ------------------------------------------------------------- */}
      <section className="relative z-10 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            {t.faqTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {t.faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="rounded-2xl bg-white border border-emerald-100 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm sm:text-base text-slate-900 hover:text-[#2E7D32] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-[#2E7D32] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* -------------------------------------------------------------
          FINAL CALL TO ACTION BANNER
      ------------------------------------------------------------- */}
      <section className="relative z-10 py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] p-8 sm:p-12 bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#15803D] text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {lang === 'en' ? 'Ready to Transform Your Farming?' : 'क्या आप अपनी खेती को स्मार्ट बनाने के लिए तैयार हैं?'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              {lang === 'en' 
                ? 'Join 50,000+ farmers using KrishiSocial for daily APMC rates, AI crop doctor, and community charcha.'
                : 'दैनिक मंडी भाव, AI फसल डॉक्टर और किसान चर्चा के लिए 50,000+ किसानों के साथ आज ही जुड़ें।'}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-8 py-4 bg-white hover:bg-emerald-50 text-[#1B5E20] rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{t.newHereBtn}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm uppercase tracking-wider border border-white/20 backdrop-blur-md active:scale-95 transition-all"
            >
              <span>{t.existingUserBtn}</span>
            </Link>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          FOOTER
      ------------------------------------------------------------- */}
      <footer className="relative z-10 w-full border-t border-emerald-200/70 bg-white/90 backdrop-blur-xl py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white shadow-xs">
              <Sprout size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-slate-900 flex items-center gap-0.5">
                Krishi<span className="text-[#2E7D32]">Social</span>
              </span>
              <span className="text-[10px] text-slate-500">
                © {new Date().getFullYear()} • Dedicated to Farmer Prosperity & Agricultural Innovation
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
            <Link href="/login" className="hover:text-[#2E7D32] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-[#2E7D32] transition-colors">
              Register Free
            </Link>
            <Link href="/mandi" className="hover:text-[#2E7D32] transition-colors">
              Mandi Rates
            </Link>
            <Link href="/disease-detector" className="hover:text-[#2E7D32] transition-colors">
              AI Crop Doctor
            </Link>
            <Link href="/weather" className="hover:text-[#2E7D32] transition-colors">
              Weather
            </Link>
          </div>

        </div>
      </footer>

      {/* -------------------------------------------------------------
          STICKY MOBILE ACTION BAR
      ------------------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-white/95 backdrop-blur-2xl border-t border-emerald-200 flex items-center gap-2.5 shadow-2xl safe-area-bottom">
        <Link
          href="/register"
          className="flex-1 h-12 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-green-900/20 active:scale-95"
        >
          <UserPlus size={16} strokeWidth={2.5} />
          <span>{lang === 'en' ? 'Register Free' : 'खाता बनाएं'}</span>
        </Link>

        <Link
          href="/login"
          className="flex-1 h-12 bg-white text-slate-900 border border-emerald-300 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95"
        >
          <LogIn size={16} className="text-[#2E7D32]" />
          <span>{lang === 'en' ? 'Sign In' : 'लॉगिन'}</span>
        </Link>
      </div>

    </div>
  );
}
