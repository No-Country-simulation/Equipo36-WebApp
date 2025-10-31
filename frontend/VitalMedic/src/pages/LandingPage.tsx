import React from 'react';
import { Shield, Clock, Users, CheckCircle, Star, ArrowRight, Phone, Mail, MapPin, Stethoscope, Calendar, FileText } from 'lucide-react';

const LandingPage: React.FC = () => {

  const handleKeycloakLogin = () => {
    // Redirect to Keycloak authentication
    window.location.href = 'https://vitalmedic-auth.onrender.com/realms/VitalMedic/protocol/openid-connect/auth?client_id=vital-medic&redirect_uri=https%3A%2F%2Fequipo36-web-app.vercel.app%2F&state=d216390f-3a38-44c1-8bae-13ccac87441e&response_mode=fragment&response_type=code&scope=openid&nonce=38d0597d-e52c-44cf-98e4-51817cce8338&code_challenge=fmSYGk1wM9eXdhX1o2xurydOtdbN2XomlmxVad32U40&code_challenge_method=S256';
  };

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-[#00AFAF]" />,
      title: "Citas Médicas",
      description: "Agenda tu consulta de forma fácil y rápida con nuestros especialistas"
    },
    {
      icon: <Clock className="w-8 h-8 text-[#00AFAF]" />,
      title: "Horarios Flexibles",
      description: "Consultas presenciales y virtuales adaptadas a tu horario"
    },
    {
      icon: <Shield className="w-8 h-8 text-[#00AFAF]" />,
      title: "Atención Personalizada",
      description: "Cuidado médico integral con seguimiento personalizado de tu salud"
    },
    {
      icon: <Users className="w-8 h-8 text-[#00AFAF]" />,
      title: "Especialistas Certificados",
      description: "Médicos especialistas con amplia experiencia y certificaciones"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src="/vital-logo.svg" alt="VitalMedic Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">VitalMedic</h1>
            </div>
            <button
              onClick={handleKeycloakLogin}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Tu salud en
                  <span className="block bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">buenas manos</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Consultorio médico especializado en brindar atención integral con tecnología de vanguardia y el cuidado humano que mereces.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleKeycloakLogin}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleKeycloakLogin}
                  className="border-2 border-sky-200 hover:border-sky-300 text-sky-700 hover:text-sky-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-sky-50"
                >
                  Ver Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-sky-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-600">5+</div>
                  <div className="text-sm text-gray-600">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-600">15+</div>
                  <div className="text-sm text-gray-600">Especialidades Médicas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfacción</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. María González</h3>
                      <p className="text-gray-600">Cardióloga</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-sky-600" />
                      <span className="text-sm text-gray-700">Próxima cita: Hoy 3:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">Consulta completada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
              ¿Por qué elegir nuestro consultorio?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos atención médica integral con tecnología de vanguardia y el toque humano que necesitas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 transition-all duration-300 border border-sky-100 hover:border-sky-200 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(feature.icon, { className: "h-7 w-7 text-white" })}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Gestiona tu salud de manera inteligente
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  VitalMedic te ofrece todas las herramientas que necesitas para mantener un control completo de tu bienestar.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Historial médico completo</h4>
                    <p className="text-gray-600">Accede a todos tus registros médicos, recetas y resultados de exámenes en un solo lugar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consultas virtuales HD</h4>
                    <p className="text-gray-600">Videollamadas de alta calidad con tus médicos desde la comodidad de tu hogar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Recordatorios inteligentes</h4>
                    <p className="text-gray-600">Nunca olvides tomar tus medicamentos o asistir a tus citas médicas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reportes de salud</h4>
                    <p className="text-gray-600">Genera reportes detallados de tu progreso y compártelos con tus médicos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Historial Médico</h4>
                      <p className="text-sm text-gray-600">Última actualización: Hace 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Medicamentos</h4>
                      <p className="text-sm text-gray-600">Recordatorio: 8:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Próxima Cita</h4>
                      <p className="text-sm text-gray-600">Dr. García - Mañana 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de pacientes y médicos confían en VitalMedic para gestionar su salud
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "VitalMedic ha transformado completamente cómo manejo mi salud. La facilidad para agendar citas y acceder a mi historial médico es increíble."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">María Contreras</h4>
                  <p className="text-sm text-gray-600">Paciente</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-100">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Como médico, VitalMedic me permite brindar mejor atención a mis pacientes. Las consultas virtuales son de excelente calidad."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">DR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Dr. Roberto Silva</h4>
                  <p className="text-sm text-gray-600">Cardiólogo</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-100 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "La seguridad y privacidad que ofrece VitalMedic me da total confianza. Mis datos están siempre protegidos."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">AL</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana López</h4>
                  <p className="text-sm text-gray-600">Paciente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Comienza tu cuidado médico hoy
              </h2>
              <p className="text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
                Agenda tu cita y experimenta la diferencia de una atención médica personalizada
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleKeycloakLogin}
                className="bg-white hover:bg-gray-50 text-sky-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Agendar Cita
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={handleKeycloakLogin}
                className="border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                Acceder a mi cuenta
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sky-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Gratis por 30 días</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Sin compromiso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/vital-logo.svg" alt="VitalMedic Logo" className="w-10 h-10" />
                <span className="text-2xl font-bold">VitalMedic</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transformando la atención médica a través de la tecnología, conectando pacientes y médicos de manera segura y eficiente.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Producto</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Características</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Precios</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Seguridad</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Soporte</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Centro de Ayuda</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentación</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Estado del Sistema</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contacto</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-sky-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-sky-400" />
                  <span className="text-gray-400">hola@vitalmedic.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <span className="text-gray-400">Ciudad de México, México</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 VitalMedic. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;