import React from 'react';

const SimpleLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col relative overflow-hidden">
      {/* Aquí no hay Navbar ni Footer. 
        Solo renderizamos el hijo (Login, FAQ, etc.) 
        asegurando el contexto de estilos base.
      */}
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      {/* Opcional: Si quieres un fondo decorativo común para estas páginas, iría aquí */}
      {/* <div className="absolute inset-0 bg-[url('...')] opacity-5 pointer-events-none"></div> */}
    </div>
  );
};

export default SimpleLayout;