'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  Gavel, 
  Lock, 
  Wallet, 
  CalendarDays, 
  Package, 
  PenTool,
  BadgeCheck,
  ChevronRight,
  X,
  Loader2,
  Shield,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type PayMethod = 'paypal' | 'nequi' | 'bancolombia' | 'daviplata' | 'pse';
type PayState = 'idle' | 'processing' | 'success';

const PSE_BANKS = [
  'Banco de Bogotá', 'Bancolombia', 'Davivienda', 'BBVA Colombia',
  'Banco de Occidente', 'Banco Popular', 'Colpatria', 'AV Villas',
];

const PAYMENT_METHODS: {
  id: PayMethod; label: string; description: string;
  bg: string; border: string; color: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'paypal', label: 'PayPal', description: 'Paga con tu cuenta PayPal de forma segura.',
    bg: '#f0f4ff', border: '#c5d5f5', color: '#003087',
    icon: (
      <svg viewBox="0 0 80 32" className="w-16 h-7">
        {/* Dark blue P */}
        <text x="2" y="26" fontSize="28" fontWeight="900" fill="#003087" fontFamily="Arial, sans-serif">P</text>
        {/* Light blue P offset */}
        <text x="14" y="28" fontSize="26" fontWeight="900" fill="#009cde" fontFamily="Arial, sans-serif">P</text>
        {/* ayPal text */}
        <text x="30" y="26" fontSize="20" fontWeight="700" fill="#003087" fontFamily="Arial, sans-serif">ayPal</text>
      </svg>
    ),
  },
  {
    id: 'nequi', label: 'Nequi', description: 'Paga desde tu app Nequi en segundos.',
    bg: '#ffffff', border: '#e0e0e0', color: '#1a0a2e',
    icon: (
      /* Nequi: pink square + dark N — exact brand style */
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        {/* Pink/magenta square dot (top-left) */}
        <rect x="4" y="5" width="14" height="14" rx="2.5" fill="#FF0090"/>
        {/* Dark N letter */}
        <text x="5" y="54" fontSize="50" fontWeight="900" fill="#1a0a2e" fontFamily="'Arial Black', Arial, sans-serif">N</text>
      </svg>
    ),
  },
  {
    id: 'bancolombia', label: 'Bancolombia', description: 'Transfiere directamente desde Bancolombia.',
    bg: '#fff8e1', border: '#ffe082', color: '#78350f',
    icon: (
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect width="56" height="56" rx="12" fill="#FFCC00"/>
        {/* Stylised B */}
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontSize="28" fontWeight="900" fill="#0a2240" fontFamily="'Arial Black', Arial, sans-serif">B</text>
        {/* Yellow wave bar at bottom */}
        <rect x="8" y="44" width="40" height="4" rx="2" fill="#0a2240" opacity="0.15"/>
      </svg>
    ),
  },
  {
    id: 'daviplata', label: 'Daviplata', description: 'Paga con tu billetera Daviplata.',
    bg: '#fff1f2', border: '#fca5a5', color: '#e0001b',
    icon: (
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect width="56" height="56" rx="12" fill="#E0001B"/>
        <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle"
          fontSize="15" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">Davi</text>
        <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle"
          fontSize="12" fontWeight="700" fill="white" fontFamily="Arial, sans-serif">plata</text>
      </svg>
    ),
  },
  {
    id: 'pse', label: 'PSE', description: 'Débito desde cualquier banco colombiano.',
    bg: '#e8f0fe', border: '#93c5fd', color: '#0d47a1',
    icon: (
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect width="56" height="56" rx="12" fill="#0D3F8F"/>
        {/* White PSE letters */}
        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
          fontSize="22" fontWeight="900" fill="white" fontFamily="'Arial Black', Arial, sans-serif">PSE</text>
        {/* Bottom accent line */}
        <rect x="10" y="44" width="36" height="3" rx="1.5" fill="#4fc3f7"/>
      </svg>
    ),
  },
];

const ContractConfirmationPage = () => {
  const router = useRouter();

  // Payment modal state
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PayMethod | null>(null);
  const [payState, setPayState] = useState<PayState>('idle');
  const [ppEmail, setPpEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pseBank, setPseBank] = useState('');
  const [pseDoc, setPseDoc] = useState('');

  const HALF = '$9.00';

  const openPayModal = () => {
    setSelectedMethod(null);
    setPayState('idle');
    setIsPayOpen(true);
  };

  const closePayModal = () => {
    if (payState === 'processing') return;
    setIsPayOpen(false);
    setSelectedMethod(null);
    setPayState('idle');
    setPpEmail(''); setPhone(''); setPseBank(''); setPseDoc('');
  };

  const handlePay = () => {
    setPayState('processing');
    setTimeout(() => {
      setPayState('success');
    }, 2800);
  };

  const copyText = (t: string) => navigator.clipboard.writeText(t).catch(() => {});

  const selectedConfig = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  const renderPayBody = () => {
    if (payState === 'success') {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-10 px-6 gap-4 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="text-green-500" size={44} />
          </div>
          <h3 className="text-2xl font-extrabold text-[#0d1c2e]">¡Pago Exitoso!</h3>
          <p className="text-[#43474b] text-sm leading-relaxed max-w-xs">
            La primera mitad ha sido procesada. Tu contrato ahora está activo y el profesional ha sido notificado.
          </p>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 w-full">
            <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-1">Anticipo pagado</p>
            <p className="text-2xl font-black text-green-600">{HALF}</p>
          </div>
          <button
            onClick={() => { setIsPayOpen(false); router.push('/seguimiento-proyecto'); }}
            className="mt-2 w-full py-4 bg-[#0d1c2e] text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
          >
            Ir al Seguimiento del Proyecto →
          </button>
        </motion.div>
      );
    }
    if (payState === 'processing') {
      return (
        <div className="flex flex-col items-center py-14 gap-4 text-center">
          <Loader2 className="animate-spin text-sky-500" size={48} />
          <p className="text-[#0d1c2e] font-bold text-lg">Procesando pago...</p>
          <p className="text-[#43474b] text-sm">Por favor espera, no cierres esta ventana.</p>
        </div>
      );
    }
    if (!selectedMethod) {
      return (
        <div className="px-6 pb-6 space-y-3">
          <p className="text-sm text-[#43474b] font-medium mb-4">Selecciona tu método de pago para el anticipo de <strong className="text-[#0d1c2e]">{HALF}</strong>.</p>
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => setSelectedMethod(m.id)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: m.bg, border: `1.5px solid ${m.border}` }}>{m.icon}</div>
              <div className="flex-1">
                <p className="font-bold text-[#0d1c2e]">{m.label}</p>
                <p className="text-xs text-[#73787b] font-medium mt-0.5">{m.description}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300 shrink-0" />
            </button>
          ))}
        </div>
      );
    }
    if (selectedMethod === 'paypal') return (
      <div className="space-y-4 px-6 pb-6">
        <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-1 text-xs text-[#50616b] font-bold mb-2 hover:underline"><ArrowLeft size={14}/> Volver</button>
        <p className="text-sm text-[#43474b]">Ingresa tu correo PayPal para autorizar <strong>{HALF}</strong>.</p>
        <input type="email" value={ppEmail} onChange={e => setPpEmail(e.target.value)} placeholder="tucorreo@paypal.com"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-400 outline-none transition-all" />
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
          <Shield size={14} className="text-blue-500 shrink-0"/>
          <p className="text-xs text-blue-700 font-medium">Protegido por PayPal Buyer Protection</p>
        </div>
        <button onClick={handlePay} disabled={!ppEmail.includes('@')}
          className="w-full py-4 bg-[#003087] text-white font-bold rounded-2xl hover:bg-[#002266] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          Pagar con PayPal · {HALF}
        </button>
      </div>
    );
    if (selectedMethod === 'nequi') return (
      <div className="space-y-4 px-6 pb-6">
        <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-1 text-xs text-[#50616b] font-bold mb-2 hover:underline"><ArrowLeft size={14}/> Volver</button>
        <p className="text-sm text-[#43474b]">Ingresa tu celular Nequi. Recibirás una notificación push para confirmar <strong>{HALF}</strong>.</p>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="3XX XXX XXXX"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all" />
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-purple-500 shrink-0"/>
          <p className="text-xs text-purple-700 font-medium">Confirma en tu app Nequi cuando recibas la notificación.</p>
        </div>
        <button onClick={handlePay} disabled={phone.length < 10} style={{ background: '#6c00ea' }}
          className="w-full py-4 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          Enviar solicitud · {HALF}
        </button>
      </div>
    );
    if (selectedMethod === 'bancolombia') {
      const ref = 'BC-TM-89231-A';
      return (
        <div className="space-y-4 px-6 pb-6">
          <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-1 text-xs text-[#50616b] font-bold mb-2 hover:underline"><ArrowLeft size={14}/> Volver</button>
          <p className="text-sm text-[#43474b]">Transfiere <strong>{HALF}</strong> a la siguiente cuenta.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 space-y-3">
            {[{l:'Cuenta de ahorros',v:'420-123456-78'},{l:'NIT',v:'900.123.456-7'},{l:'Referencia',v:ref}].map(i=>(
              <div key={i.l} className="flex justify-between items-center">
                <div><p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">{i.l}</p><p className="text-sm font-bold text-[#0d1c2e]">{i.v}</p></div>
                <button onClick={() => copyText(i.v)} className="p-2 hover:bg-yellow-100 rounded-lg"><Copy size={13} className="text-yellow-600"/></button>
              </div>
            ))}
          </div>
          <button onClick={handlePay} style={{ background: '#f5a800' }}
            className="w-full py-4 font-bold rounded-2xl transition-all active:scale-95 text-[#0d1c2e] flex items-center justify-center gap-2">
            <ExternalLink size={16}/> Confirmar transferencia · {HALF}
          </button>
        </div>
      );
    }
    if (selectedMethod === 'daviplata') return (
      <div className="space-y-4 px-6 pb-6">
        <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-1 text-xs text-[#50616b] font-bold mb-2 hover:underline"><ArrowLeft size={14}/> Volver</button>
        <p className="text-sm text-[#43474b]">Ingresa tu celular Daviplata para pagar <strong>{HALF}</strong>.</p>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="3XX XXX XXXX"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400 outline-none transition-all" />
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500 shrink-0"/>
          <p className="text-xs text-red-700 font-medium">Recibirás un código de confirmación en tu celular.</p>
        </div>
        <button onClick={handlePay} disabled={phone.length < 10}
          className="w-full py-4 bg-[#e0001b] text-white font-bold rounded-2xl hover:bg-[#b5001a] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          Pagar con Daviplata · {HALF}
        </button>
      </div>
    );
    if (selectedMethod === 'pse') return (
      <div className="space-y-4 px-6 pb-6">
        <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-1 text-xs text-[#50616b] font-bold mb-2 hover:underline"><ArrowLeft size={14}/> Volver</button>
        <p className="text-sm text-[#43474b]">Paga <strong>{HALF}</strong> mediante débito bancario (PSE).</p>
        <select value={pseBank} onChange={e => setPseBank(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white transition-all">
          <option value="">Selecciona tu banco</option>
          {PSE_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <input type="text" value={pseDoc} onChange={e => setPseDoc(e.target.value.replace(/\D/g,'').slice(0,12))} placeholder="Número de cédula"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
        <button onClick={handlePay} disabled={!pseBank || pseDoc.length < 6}
          className="w-full py-4 bg-[#0d47a1] text-white font-bold rounded-2xl hover:bg-[#093578] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
          Pagar con PSE · {HALF}
        </button>
      </div>
    );
    return null;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] pb-32 md:pb-40 font-sans">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#C5A059]/20 shadow-sm">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center w-full px-4 md:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-[#5C6B73]"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C5A059]/40 bg-white flex items-center justify-center p-1 shadow-sm">
                <img src="/classmarket-logo.png" alt="ClassMarket" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-extrabold text-[#0B2545] tracking-tight leading-none flex items-center gap-1.5">
                  ClassMarket
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#0B2545] border border-[#C5A059]/30">Estudiantil</span>
                </span>
                <span className="text-[10px] font-semibold text-[#5C6B73]">Educación e Intercambio Real</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#C5A059]/15 text-[#0B2545] border border-[#C5A059]/30 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
              <BadgeCheck size={14} className="text-[#C5A059]" />
              <span className="hidden sm:inline">Custodia Escrow Estudiantil</span>
              <span className="sm:hidden">Escrow</span>
            </div>
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#C5A059]/30 shadow-sm overflow-hidden">
               <Image 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                alt="User profile" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 md:space-y-12"
        >
          {/* Hero Section */}
          <motion.section 
            variants={itemVariants}
            className="classmarket-hero rounded-3xl p-6 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl -mr-32 -mt-32 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e0f2fe]/30 blur-3xl -ml-24 -mb-24 rounded-full"></div>
            
            <div className="flex-1 space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
              <div className="inline-block px-4 py-1.5 bg-[#C5A059]/20 backdrop-blur-sm rounded-full text-[#0B2545] font-bold text-[10px] md:text-xs tracking-wider uppercase border border-[#C5A059]/40">
                ACUERDO ACADÉMICO DIGITAL
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-[#0B2545] tracking-tight leading-[1.1]">
                Confirmación de Contrato
              </h2>
              <p className="text-lg md:text-xl text-[#5C6B73] max-w-xl mx-auto md:mx-0 leading-relaxed">
                Tu tutoría está asegurada. Ambos estudiantes han acordado los términos y el pago queda protegido en custodia hasta completar la sesión.
              </p>
            </div>

            <div className="relative w-48 h-48 md:w-80 md:h-80 flex-shrink-0">
              <div className="absolute inset-0 bg-[#C5A059]/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image 
                  src="/images/student_contract_confirmation.jpg"
                  alt="Estudiantes firmando contrato académico"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.section>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Price Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 border border-[#C5A059]/30 flex flex-col justify-between hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0B2545]/10 flex items-center justify-center mb-6 text-[#0B2545]">
                  <Wallet size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0B2545] mb-2">Acuerdo de Tutoría</h3>
                <p className="text-[#5C6B73] text-sm mb-6">Monto protegido en custodia escolar hasta completar la sesión.</p>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                $15.00 <span className="text-sm font-semibold text-[#5C6B73] tracking-normal">USD</span>
              </div>
            </motion.div>

            {/* Deadline Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 border border-[#C5A059]/30 flex flex-col justify-between hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 flex items-center justify-center mb-6 text-[#0B2545]">
                  <CalendarDays size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0B2545] mb-2">Fecha de Entrega</h3>
                <p className="text-[#5C6B73] text-sm mb-6">Plazo estipulado para la entrega de la guía o clase.</p>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                2 <span className="text-sm font-semibold text-[#5C6B73] tracking-normal">Días</span>
              </div>
            </motion.div>

            {/* Deliverables Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] p-8 border border-[#C5A059]/30 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] flex items-center justify-center mb-6 text-[#0B2545] border border-gray-100">
                <Package size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#0B2545] mb-4">Compromisos Académicos</h3>
              <ul className="space-y-4">
                {[
                  "Guía de ejercicios resuelta paso a paso con fórmulas explicadas.",
                  "Sesión virtual de 1 hora para dudas y resolución en vivo.",
                  "Material de estudio y resumen en PDF para el examen."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-[#5C6B73]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Payment Structure Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-6 md:p-10 border border-[#dce9ff]/50 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#C5A059]/40 flex items-center justify-center text-[#0B2545]">
                <Wallet size={26} className="text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0d1c2e]">Estructura de Pago</h3>
                <p className="text-[#43474b] text-sm mt-0.5">Según lo acordado entre cliente y profesional</p>
              </div>
            </div>

            {/* Total agreed amount */}
            <div className="bg-gradient-to-br from-[#0B2545]/5 to-[#C5A059]/10 rounded-2xl p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#C5A059]/30">
              <div>
                <p className="text-[10px] font-black text-[#5C6B73] uppercase tracking-widest mb-1">Costo Total Acordado</p>
                <p className="text-4xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight">
                  $18.00 <span className="text-base font-semibold text-[#5C6B73] tracking-normal">USD</span>
                </p>
              </div>
              <div className="bg-white/90 rounded-xl px-4 py-2.5 border border-[#C5A059]/30 text-center shadow-sm">
                <p className="text-[10px] font-black text-[#5C6B73] uppercase tracking-widest">Modalidad</p>
                <p className="text-sm font-bold text-[#0B2545] mt-0.5">Pago en 2 partes</p>
              </div>
            </div>

            {/* Two-step payment cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Step 1 */}
              <div className="relative bg-[#0B2545]/5 rounded-2xl p-5 border border-[#0B2545]/15 overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0B2545] flex items-center justify-center text-white text-xs font-black shadow-sm">1</div>
                <p className="text-[10px] font-black text-[#0B2545] uppercase tracking-widest mb-2">Al iniciar el contrato</p>
                <p className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
                  $9.00 <span className="text-sm font-semibold text-[#5C6B73]">USD</span>
                </p>
                <p className="text-xs text-[#5C6B73] font-medium mt-2 leading-relaxed">
                  Se cobra el 50% al momento de firmar. Estos fondos quedan protegidos en custodia estudiantil (escrow) hasta recibir la sesión o material.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[#0B2545]">
                  <Lock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Retenido en garantía</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-[#C5A059]/10 rounded-2xl p-5 border border-[#C5A059]/30 overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0B2545] text-xs font-black shadow-sm">2</div>
                <p className="text-[10px] font-black text-[#0B2545] uppercase tracking-widest mb-2">Al entregar la tutoría / guía</p>
                <p className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
                  $9.00 <span className="text-sm font-semibold text-[#5C6B73]">USD</span>
                </p>
                <p className="text-xs text-[#5C6B73] font-medium mt-2 leading-relaxed">
                  La segunda mitad se transfiere al tutor únicamente cuando confirmas que la clase o taller se completó a entera satisfacción.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[#0B2545]">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Liberado al confirmar entrega</span>
                </div>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-[#fffbeb] border border-[#fde68a]/60 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fde68a]/60 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-base">🔒</span>
              </div>
              <p className="text-sm text-[#78350f] leading-relaxed font-medium">
                <strong>¿Por qué pagos en dos partes?</strong> Este sistema protege tanto al cliente como al profesional. El cliente sabe que no perderá su dinero si el trabajo no se entrega, y el profesional recibe un anticipo seguro antes de comenzar.
              </p>
            </div>
          </motion.div>

          {/* Compliance Clauses */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-[#dce9ff]/50 mb-12 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div className="space-y-1">
                <h3 className="text-2xl md:text-4xl font-bold text-[#0d1c2e]">Cláusulas de Cumplimiento</h3>
                <p className="text-[#43474b]">Revisa los términos de protección automática</p>
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-[#e0f2fe] hover:bg-[#dce9ff] text-[#50616b] rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-sm">
                <Download size={18} /> Descargar PDF
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-8">
                <div className="p-6 md:p-8 bg-[#e0f2fe]/30 rounded-2xl border border-[#e0f2fe]/50 hover:border-[#50616b]/20 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#50616b]/10 flex items-center justify-center text-[#50616b]">
                      <Gavel size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-[#0d1c2e]">Arbitraje Automático</h4>
                  </div>
                  <p className="text-base text-[#43474b] leading-relaxed">
                    En caso de disputa, el contrato entrará en una fase de mediación digital procesada por nodos de confianza, asegurando imparcialidad absoluta y rapidez en la resolución.
                  </p>
                </div>

                <div className="p-6 md:p-8 bg-[#e0f2fe]/30 rounded-2xl border border-[#e0f2fe]/50 hover:border-[#6b5a60]/20 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#6b5a60]/10 flex items-center justify-center text-[#6b5a60]">
                      <Lock size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-[#0d1c2e]">Depósito en Garantía</h4>
                  </div>
                  <p className="text-base text-[#43474b] leading-relaxed">
                    Los fondos serán retenidos en un "Escrow Account" inteligente y solo se liberarán tras la validación mutua de los entregables mediante tokens de aceptación.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl h-[300px] md:h-auto min-h-[400px] group shadow-lg">
                <Image 
                  src="/images/student_contract_confirmation.jpg"
                  alt="Contrato Académico Estudiantil"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-[#0B2545]/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <p className="text-white text-xl md:text-2xl font-medium italic leading-snug">
                    "La educación entre pares, respaldada por garantía digital. Aprende y enseña con confianza."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-[#dce9ff]/50 z-[100] shadow-2xl">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 md:py-6">
          {/* Mobile Layout */}
          <div className="flex md:hidden flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0B2545]/10 flex items-center justify-center text-[#0B2545]">
                <PenTool size={20} />
              </div>
              <div>
                <p className="text-[10px] text-[#73787b] font-bold uppercase tracking-widest">Estado</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                  <p className="text-[#0d1c2e] font-bold text-sm">Pendiente de Firma Digital</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => router.back()}
                className="flex-1 px-4 py-4 text-[#43474b] font-bold text-sm bg-[#e6eeff]/50 rounded-full active:scale-95 transition-transform"
              >
                Revisar
              </button>
              <button 
                onClick={openPayModal}
                className="flex-[2] px-4 py-4 bg-[#0B2545] text-white font-bold rounded-full shadow-lg shadow-[#0B2545]/20 flex items-center justify-center gap-2 active:scale-95 transition-transform border border-[#C5A059]/30"
              >
                Firmar Contrato <PenTool size={18} />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-[#0B2545]/10 flex items-center justify-center text-[#0B2545] ring-8 ring-[#0B2545]/5">
                <PenTool size={28} />
              </div>
              <div>
                <p className="text-xs text-[#73787b] font-bold uppercase tracking-widest mb-1">Estado Actual del Contrato</p>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                  <p className="text-[#0d1c2e] font-bold text-xl">Pendiente de Firma Digital</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.back()}
                className="px-8 py-4 text-[#43474b] font-bold hover:bg-[#e6eeff] rounded-full transition-all"
              >
                Revisar Términos
              </button>
              <button 
                onClick={openPayModal}
                className="px-14 py-5 bg-[#0B2545] hover:bg-[#12335d] text-white font-bold rounded-full shadow-2xl shadow-[#0B2545]/30 flex items-center gap-3 transform hover:-translate-y-1 transition-all text-lg border border-[#C5A059]/40"
              >
                Firmar Contrato Digitalmente
                <PenTool size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPayOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePayModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-[201] pointer-events-none"
            >
              <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md pointer-events-auto shadow-2xl overflow-hidden">
                {/* Modal header */}
                {payState !== 'success' && payState !== 'processing' && (
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      {selectedConfig ? (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedConfig.bg }}>{selectedConfig.icon}</div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/30 flex items-center justify-center"><Wallet size={20} className="text-[#C5A059]" /></div>
                      )}
                      <div>
                        <p className="font-extrabold text-[#0d1c2e] text-base">{selectedConfig ? selectedConfig.label : 'Pago del Anticipo'}</p>
                        <p className="text-xs text-[#73787b] font-medium">Primera mitad · {HALF}</p>
                      </div>
                    </div>
                    <button onClick={closePayModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <X size={18} className="text-[#73787b]" />
                    </button>
                  </div>
                )}
                <div className="pt-4">{renderPayBody()}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .classmarket-hero {
          background: linear-gradient(135deg, #0B2545 0%, #0e2d52 60%, #1a3d6e 100%);
        }
        .classmarket-hero h2, .classmarket-hero p {
          color: white;
        }
        .classmarket-hero .text-\[\#5C6B73\] {
          color: rgba(255, 255, 255, 0.75);
        }
      `}</style>
    </div>
  );
};

export default ContractConfirmationPage;
