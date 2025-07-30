export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <span className="text-[#262626] text-sm">
          © {new Date().getFullYear()} ActasExpress. Todos los derechos
          reservados.
        </span>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/soporte" className="text-[#1061ff] hover:underline text-sm">
            Soporte
          </a>
          <a
            href="/privacidad"
            className="text-[#1061ff] hover:underline text-sm"
          >
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
