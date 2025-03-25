import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/placeholder.svg?height=60&width=180&text=FCF+CAMPS"
                alt="FCF Camps Logo"
                width={180}
                height={60}
                className="h-16 w-auto"
              />
            </Link>
            <h3 className="text-3xl font-bold text-yellow-400 mb-2">FCF CAMPS 2025</h3>
            <p className="text-blue-200 max-w-md mx-auto">
              La mejor experiencia de fútbol para niños. ¡Inscríbete ahora y vive una experiencia inolvidable!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="#"
              className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-colors transform hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>

            <a
              href="#"
              className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 p-3 rounded-full transition-colors transform hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>

            <a
              href="#"
              className="bg-black hover:bg-gray-800 p-3 rounded-full transition-colors transform hover:scale-110"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>

            <a
              href="#"
              className="bg-green-600 hover:bg-green-500 p-3 rounded-full transition-colors transform hover:scale-110"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M21.105 4.893c.586.585.586 1.536 0 2.12l-2.122 2.122a1.5 1.5 0 01-2.121 0l-.707-.707a.5.5 0 01.707-.707l.707.707a.5.5 0 00.707 0l2.122-2.122a.5.5 0 000-.707l-.707-.707a.5.5 0 00-.707 0L17.207 7.07a.5.5 0 01-.707-.707l1.768-1.768a1.5 1.5 0 012.121 0l.707.707zM12.001 5c-3.866 0-7 3.134-7 7 0 1.245.324 2.414.893 3.428L4.37 18.312a.75.75 0 00.926.925l2.997-1.588c1.005.557 2.16.874 3.385.874 3.866 0 7-3.134 7-7s-3.134-7-7-7zm0 2c2.761 0 5 2.239 5 5s-2.239 5-5 5c-1.032 0-1.99-.313-2.787-.848a.75.75 0 00-.633-.066l-1.28.678.679-1.28a.75.75 0 00-.066-.634A4.966 4.966 0 017 12c0-2.761 2.239-5 5-5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
            <div>
              <h4 className="text-lg font-bold text-yellow-300 mb-2">Contacto</h4>
              <p className="text-blue-200">info@fcfcamps.com</p>
              <p className="text-blue-200">+57 300 123 4567</p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-yellow-300 mb-2">Ubicaciones</h4>
              <p className="text-blue-200">Centro Deportivo FCF - Bogotá</p>
              <p className="text-blue-200">Complejo Deportivo - Barranquilla</p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-yellow-300 mb-2">Enlaces Rápidos</h4>
              <div className="flex flex-col space-y-1">
                <Link href="/" className="text-blue-200 hover:text-yellow-300 transition-colors">
                  Inicio
                </Link>
                <Link href="/#beneficios" className="text-blue-200 hover:text-yellow-300 transition-colors">
                  Beneficios
                </Link>
                <Link href="/#categorias" className="text-blue-200 hover:text-yellow-300 transition-colors">
                  Categorías
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-700 pt-6 text-center">
            <p className="text-sm text-blue-300">
              © {new Date().getFullYear()} Federación Colombiana de Fútbol. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

