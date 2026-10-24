'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  BookOpen,
  HeadphonesIcon,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────── */
type PayMethod = 'paypal' | 'nequi' | 'bancolombia' | 'daviplata' | 'pse';

interface PaymentStatus {
  state: 'idle' | 'processing' | 'success' | 'error';
  method: PayMethod | null;
}

/* ─── Payment method configs ─────────────────────────── */
const METHODS: {
  id: PayMethod;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: 'paypal',
    label: 'PayPal',
    color: '#003087',
    bg: '#f0f4ff',
    border: '#c5d5f5',
    description: 'Paga con tu cuenta PayPal de forma segura.',
    icon: (
      <svg viewBox="0 0 80 32" className="w-16 h-7">
        <text x="2" y="26" fontSize="28" fontWeight="900" fill="#003087" fontFamily="Arial, sans-serif">P</text>
        <text x="14" y="28" fontSize="26" fontWeight="900" fill="#009cde" fontFamily="Arial, sans-serif">P</text>
        <text x="30" y="26" fontSize="20" fontWeight="700" fill="#003087" fontFamily="Arial, sans-serif">ayPal</text>
      </svg>
    ),
  },
  {
    id: 'nequi',
    label: 'Nequi',
    color: '#1a0a2e',
    bg: '#ffffff',
    border: '#e0e0e0',
    description: 'Paga desde tu app Nequi en segundos.',
    icon: (
      /* Nequi: punto magenta + N oscura — estilo original de la marca */
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect x="4" y="5" width="14" height="14" rx="2.5" fill="#FF0090" />
        <text x="5" y="54" fontSize="50" fontWeight="900" fill="#1a0a2e" fontFamily="'Arial Black', Arial, sans-serif">N</text>
      </svg>
    ),
  },
  {
    id: 'bancolombia',
    label: 'Bancolombia',
    color: '#0a2240',
    bg: '#fff8e1',
    border: '#ffe082',
    description: 'Transfiere directamente desde Bancolombia.',
    icon: (
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect width="56" height="56" rx="12" fill="#FFCC00" />
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontSize="28" fontWeight="900" fill="#0a2240" fontFamily="'Arial Black', Arial, sans-serif">B</text>
        <rect x="8" y="44" width="40" height="4" rx="2" fill="#0a2240" opacity="0.15" />
      </svg>
    ),
  },
  {
    id: 'daviplata',
    label: 'Daviplata',
    color: '#e0001b',
    bg: '#fff1f2',
    border: '#fca5a5',
    description: 'Paga con tu billetera Daviplata.',
    icon: (
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect width="56" height="56" rx="12" fill="#E0001B" />
        <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle"
          fontSize="15" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">Davi</text>
        <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle"
          fontSize="12" fontWeight="700" fill="white" fontFamily="Arial, sans-serif">plata</text>
      </svg>
    ),
  },
  {
    id: 'pse',
    label: 'PSE',
    color: '#0d47a1',
    bg: '#e8f0fe',
    border: '#93c5fd',
    description: 'Débito automático desde cualquier banco colombiano.',
    icon: (
      <svg viewBox="0 0 56 56" className="w-10 h-10">
        <rect width="56" height="56" rx="12" fill="#0D3F8F" />
        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
          fontSize="22" fontWeight="900" fill="white" fontFamily="'Arial Black', Arial, sans-serif">PSE</text>
        <rect x="10" y="44" width="36" height="3" rx="1.5" fill="#4fc3f7" />
      </svg>
    ),
  },
];

/* ─── PSE Banks ─────────────────────────────────────── */
const PSE_BANKS = [
  'Banco de Bogotá', 'Bancolombia', 'Davivienda', 'BBVA Colombia',
  'Banco de Occidente', 'Banco Popular', 'Colpatria', 'AV Villas',
];

export default function LiberacionFondosPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PayMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, setPayment] = useState<PaymentStatus>({ state: 'idle', method: null });

  // PayPal fields
  const [ppEmail, setPpEmail] = useState('');
  // Nequi/Daviplata fields
  const [phone, setPhone] = useState('');
  // PSE fields
  const [pseBank, setPseBank] = useState('');
  const [pseDoc, setPseDoc] = useState('');

  const TOTAL = '$9.00';
  const TOTAL_CONTRACT = '$18.00';

  const openModal = (id: PayMethod) => {
    setSelectedMethod(id);
    setPayment({ state: 'idle', method: null });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (payment.state === 'processing') return;
    setIsModalOpen(false);
    setSelectedMethod(null);
    setPayment({ state: 'idle', method: null });
  };

  const handlePay = () => {
    setPayment({ state: 'processing', method: selectedMethod });
    setTimeout(() => {
      setPayment({ state: 'success', method: selectedMethod });
    }, 2800);
  };

  const downloadReceiptPDF = () => {
    const docContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [ 0 0 595 842 ] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 320 >>
stream
BT
/F1 20 Tf
50 750 Td
(TRUSTMARKET - RECIBO DE PAGO FINAL) Tj
/F1 12 Tf
0 -40 Td
(Referencia de Pago: #MP-8829-XQ) Tj
0 -20 Td
(Estado: EXITOSO) Tj
0 -20 Td
(Monto Liberado: $2,250.00 USD) Tj
0 -20 Td
(Profesional Beneficiario: Expert Professional) Tj
0 -20 Td
(Servicio: Diseno de Identidad Visual Premium) Tj
0 -20 Td
(Fecha de Pago: 24 de Mayo, 2026) Tj
0 -30 Td
(Este documento es un comprobante de transaccion emitida de forma segura por TrustMarket.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000130 00000 n 
0000000257 00000 n 
0000000329 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
700
%%EOF`;

    const blob = new Blob([docContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Recibo_Pago_TrustMarket_2250.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copied = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const methodConfig = METHODS.find(m => m.id === selectedMethod);

  /* ─── Modal inner content per method ────────────── */
  const renderModalBody = () => {
    if (payment.state === 'success') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-10 px-6 gap-4 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <CheckCircle2 className="text-green-500" size={44} />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">¡Pago Exitoso!</h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Los fondos han sido liberados al profesional. El contrato ha sido completado satisfactoriamente.
          </p>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 w-full mt-2">
            <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-1">Monto liberado</p>
            <p className="text-2xl font-black text-green-600">{TOTAL}</p>
          </div>
          <div className="space-y-3 w-full mt-4">
            <button
              onClick={downloadReceiptPDF}
              className="w-full py-4 bg-[#0d1c2e] hover:bg-slate-800 text-white font-bold rounded-2xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              Ver Recibo de Pago
            </button>
            <button
              onClick={() => router.push('/confirmacion-pago-final')}
              className="w-full py-4 bg-[#0B2545] hover:bg-[#134074] text-white font-bold rounded-2xl transition-all active:scale-95 text-sm border border-[#C5A059]/40"
            >
              Siguiente
            </button>
          </div>
        </motion.div>
      );
    }

    if (payment.state === 'processing') {
      return (
        <div className="flex flex-col items-center py-14 gap-4 text-center">
          <Loader2 className="animate-spin text-sky-500" size={48} />
          <p className="text-slate-700 font-bold text-lg">Procesando pago...</p>
          <p className="text-slate-400 text-sm">Por favor espera, no cierres esta ventana.</p>
        </div>
      );
    }

    if (selectedMethod === 'paypal') {
      return (
        <div className="space-y-4 px-6 pb-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Ingresa tu correo de PayPal para autorizar el pago de <strong className="text-slate-800">{TOTAL}</strong>.
          </p>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Correo PayPal</label>
            <input
              type="email"
              value={ppEmail}
              onChange={e => setPpEmail(e.target.value)}
              placeholder="tucorreo@paypal.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-400 outline-none transition-all"
            />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
            <Shield size={16} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 font-medium">Protegido por PayPal Buyer Protection</p>
          </div>
          <button
            onClick={handlePay}
            disabled={!ppEmail.includes('@')}
            className="w-full py-4 bg-[#003087] text-white font-bold rounded-2xl hover:bg-[#002266] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pagar con PayPal · {TOTAL}
          </button>
        </div>
      );
    }

    if (selectedMethod === 'nequi') {
      return (
        <div className="space-y-4 px-6 pb-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Ingresa tu número de celular registrado en Nequi. Recibirás una notificación push para confirmar el pago de <strong className="text-slate-800">{TOTAL}</strong>.
          </p>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Celular Nequi</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="3XX XXX XXXX"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all"
            />
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-purple-500 shrink-0" />
            <p className="text-xs text-purple-700 font-medium">Confirma el pago en tu app Nequi cuando recibas la notificación.</p>
          </div>
          <button
            onClick={handlePay}
            disabled={phone.length < 10}
            className="w-full py-4 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#6c00ea' }}
          >
            Enviar solicitud · {TOTAL}
          </button>
        </div>
      );
    }

    if (selectedMethod === 'bancolombia') {
      const ref = 'BC-TM-89231';
      return (
        <div className="space-y-4 px-6 pb-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Transfiere <strong className="text-slate-800">{TOTAL}</strong> a la siguiente cuenta desde tu app Bancolombia o desde cualquier sucursal.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 space-y-3">
            {[
              { label: 'Cuenta de ahorros', value: '420-123456-78' },
              { label: 'NIT', value: '900.123.456-7' },
              { label: 'Referencia de pago', value: ref },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800">{item.value}</p>
                </div>
                <button onClick={() => copied(item.value)} className="p-2 hover:bg-yellow-100 rounded-lg transition-colors">
                  <Copy size={14} className="text-yellow-600" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handlePay}
            className="w-full py-4 font-bold rounded-2xl transition-all active:scale-95 text-slate-900 flex items-center justify-center gap-2"
            style={{ background: '#f5a800' }}
          >
            <ExternalLink size={18} />
            Confirmar transferencia · {TOTAL}
          </button>
        </div>
      );
    }

    if (selectedMethod === 'daviplata') {
      return (
        <div className="space-y-4 px-6 pb-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Ingresa tu número de celular registrado en Daviplata para pagar <strong className="text-slate-800">{TOTAL}</strong>.
          </p>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Celular Daviplata</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="3XX XXX XXXX"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400 outline-none transition-all"
            />
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-700 font-medium">Recibirás un código de confirmación en tu celular.</p>
          </div>
          <button
            onClick={handlePay}
            disabled={phone.length < 10}
            className="w-full py-4 bg-[#e0001b] text-white font-bold rounded-2xl hover:bg-[#b5001a] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pagar con Daviplata · {TOTAL}
          </button>
        </div>
      );
    }

    if (selectedMethod === 'pse') {
      return (
        <div className="space-y-4 px-6 pb-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Paga <strong className="text-slate-800">{TOTAL}</strong> mediante débito bancario (PSE). Selecciona tu banco y completa la transacción.
          </p>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Banco</label>
            <select
              value={pseBank}
              onChange={e => setPseBank(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all bg-white"
            >
              <option value="">Selecciona tu banco</option>
              {PSE_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Documento de identidad</label>
            <input
              type="text"
              value={pseDoc}
              onChange={e => setPseDoc(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="Número de cédula"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>
          <button
            onClick={handlePay}
            disabled={!pseBank || pseDoc.length < 6}
            className="w-full py-4 bg-[#0d47a1] text-white font-bold rounded-2xl hover:bg-[#093578] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pagar con PSE · {TOTAL}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]/80 font-sans">
      {/* Decorative blobs */}
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-sky-100/30 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="text-lg font-extrabold text-[#0d1c2e] tracking-tight">Confirmar Pago Final</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Hero celebration */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 flex items-center justify-center shadow-md mb-2">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B2545] tracking-tight">¡Listo para finalizar!</h2>
          <p className="text-slate-500 text-base max-w-md leading-relaxed">
            La tutoría y entrega del taller han sido completadas satisfactoriamente. Paga la segunda mitad del depósito en garantía para liberar los fondos al tutor.
          </p>
        </motion.div>

        {/* Contract summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-1">Servicio Prestado</p>
              <h3 className="text-xl font-extrabold text-[#0B2545]">Tutoría de Matemáticas & Taller de Álgebra</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Completado</span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C5A059]/30 flex items-center justify-center text-slate-400 text-lg">👤</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tutor Académico</p>
                <p className="text-sm font-bold text-[#0B2545]">Camila Torres (Tutor Destacado)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C5A059]/30 flex items-center justify-center text-slate-400 text-lg">📅</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entrega</p>
                <p className="text-sm font-bold text-[#0B2545]">24 de Mayo, 2026</p>
              </div>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Contrato total</span>
              <span className="font-semibold text-slate-700">{TOTAL_CONTRACT}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>1ª mitad pagada al inicio ✓</span>
              <span className="font-semibold text-green-600">- $9.00 USD</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>Tasa de Marketplace</span>
              <span className="font-semibold text-slate-700">$0.90 USD</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
              <span className="text-base font-extrabold text-[#0B2545]">Total a pagar ahora</span>
              <span className="text-2xl font-black text-[#0B2545]">{TOTAL}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-extrabold text-slate-900">Selecciona tu método de pago</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {METHODS.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal(m.id)}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: m.bg, border: `1.5px solid ${m.border}` }}
                >
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{m.label}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug">{m.description}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 pb-6">
          {[
            { Icon: Shield, label: 'Garantía Trust', color: 'text-[#0B2545]', bg: 'bg-[#FAF8F5]' },
            { Icon: BookOpen, label: 'Contrato Digital', color: 'text-[#C5A059]', bg: 'bg-[#FAF8F5]' },
            { Icon: HeadphonesIcon, label: 'Soporte 24/7', color: 'text-slate-500', bg: 'bg-slate-50' },
          ].map(({ Icon, label, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-slate-100`}>
              <Icon size={22} className={color} />
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Back to Contract Details */}
        <div className="flex flex-col items-center pt-2">
          <button 
            onClick={() => router.push('/confirmacion-contrato')}
            className="text-slate-400 hover:text-slate-600 transition-colors font-semibold text-sm hover:underline"
          >
            Revisar detalles nuevamente
          </button>
        </div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {isModalOpen && methodConfig && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            {/* Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
            >
              <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md pointer-events-auto shadow-2xl overflow-hidden">
                {/* Modal header */}
                {payment.state !== 'success' && payment.state !== 'processing' && (
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: methodConfig.bg }}
                      >
                        {methodConfig.icon}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-base">{methodConfig.label}</p>
                        <p className="text-xs text-slate-400 font-medium">{TOTAL}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <X size={18} className="text-slate-400" />
                    </button>
                  </div>
                )}

                <div className="pt-4">
                  {renderModalBody()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
