import Link from "next/link";

interface ProfessionalCardProps {
  id: string;
  nombre_completo: string;
  titulo_profesional: string;
  calificacion: number;
  reseñas?: number;
  tarifa: string | number;
  foto_perfil: string;
}

export default function ProfessionalCard({
  id,
  nombre_completo,
  titulo_profesional,
  calificacion,
  reseñas = 0,
  tarifa,
  foto_perfil,
}: ProfessionalCardProps) {
  // Asegurar que la tarifa se muestre bien
  const precio = typeof tarifa === "number" ? `$${tarifa}` : tarifa;
  
  // Arreglo de 5 estrellas
  const estrellas = Array.from({ length: 5 }, (_, i) => i < Math.round(calificacion || 0));

  return (
    <article className="bg-white rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center group border border-[#C5A059]/25 hover:border-[#C5A059]">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-5 ring-4 ring-[#C5A059]/30 transition-transform duration-500 group-hover:scale-105 relative bg-gray-50 shadow-md">
        <img 
          src={foto_perfil || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"} 
          alt={nombre_completo} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="font-extrabold text-lg text-[#0B2545] mb-1.5 group-hover:text-[#C5A059] transition-colors line-clamp-1">
        {nombre_completo}
      </h3>
      
      <p className="text-xs font-medium text-[#5C6B73] mb-5 line-clamp-2 px-1 h-9 leading-relaxed">
        {titulo_profesional}
      </p>
      
      <div className="flex items-center gap-1 mb-6 text-[#C5A059]">
        {estrellas.map((llena, index) => (
          <span 
            key={index} 
            className="material-symbols-outlined text-sm fill-current" 
            style={{ fontVariationSettings: llena ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        ))}
        <span className="text-[#5C6B73] text-xs font-semibold ml-1">
          ({reseñas})
        </span>
      </div>
      
      <div className="mt-auto w-full pt-5 border-t border-gray-100 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#5C6B73] block mb-0.5">
            TARIFA ESCOLAR
          </span>
          <span className="font-extrabold text-xl text-[#0B2545] tracking-tight">
            {precio}
          </span>
        </div>
        <Link 
          href={`/expertos/${id}?foto=${encodeURIComponent(foto_perfil || '')}&nombre=${encodeURIComponent(nombre_completo || '')}&titulo=${encodeURIComponent(titulo_profesional || '')}&tarifa=${encodeURIComponent(precio || '')}`}
          className="px-5 py-2.5 bg-[#0B2545] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#13335c] hover:shadow-md transition-all duration-300 active:scale-95 inline-block text-center border border-[#C5A059]/40"
        >
          Ver Perfil
        </Link>
      </div>
    </article>
  );
}
