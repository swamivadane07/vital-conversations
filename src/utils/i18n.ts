import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        dashboard: 'Dashboard', 
        chat: 'AI Chat',
        doctors: 'Doctors',
        labTests: 'Lab Tests',
        profile: 'Profile',
        settings: 'Settings'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        reset: 'Reset'
      },
      // Homepage
      home: {
        title: 'AI Medical Assistant',
        subtitle: 'Your intelligent healthcare companion',
        features: {
          chat: 'AI Health Chat',
          doctor: 'Doctor Consultations',
          labs: 'Lab Test Booking',
          tracking: 'Health Tracking'
        }
      },
      // Dashboard
      dashboard: {
        title: 'Health Dashboard',
        subtitle: 'Track your health journey and progress',
        metrics: {
          appointments: 'Total Appointments',
          labTests: 'Lab Tests Completed',
          healthScore: 'Health Score',
          streak: 'Days Streak'
        },
        goals: {
          steps: 'Daily Steps',
          water: 'Water Intake',
          sleep: 'Sleep Hours',
          exercise: 'Exercise Minutes'
        }
      },
      // Chat
      chat: {
        title: 'AI Health Assistant',
        placeholder: 'Type your health question here...',
        disclaimer: 'I\'m an AI assistant, not a doctor. Please consult a healthcare professional for medical decisions.',
        voiceInput: 'Voice Input',
        exportChat: 'Export Chat'
      },
      // Doctors
      doctors: {
        title: 'Find Healthcare Providers',
        subtitle: 'Connect with qualified medical professionals',
        search: 'Search doctors by name or specialization...',
        book: 'Book Appointment',
        rating: 'Rating',
        experience: 'Experience',
        location: 'Location',
        specializations: {
          gp: 'General Practitioner',
          cardiology: 'Cardiology',
          dermatology: 'Dermatology',
          neurology: 'Neurology',
          pediatrics: 'Pediatrics',
          psychiatry: 'Psychiatry',
          orthopedics: 'Orthopedics'
        }
      },
      // Lab Tests
      labTests: {
        title: 'Laboratory Tests',
        subtitle: 'Book medical tests and health screenings',
        search: 'Search for tests...',
        addToCart: 'Add to Cart',
        cart: 'Cart',
        checkout: 'Checkout',
        price: 'Price',
        duration: 'Duration',
        preparation: 'Preparation Required',
        categories: {
          blood: 'Blood Tests',
          imaging: 'Imaging',
          cardiology: 'Cardiology',
          pathology: 'Pathology',
          genetics: 'Genetic Tests'
        }
      },
      // Symptoms
      symptoms: {
        checker: 'Symptom Checker',
        bodyDiagram: 'Interactive Body Diagram',
        voiceInput: 'Voice Symptom Input',
        aiAnalysis: 'AI Health Analysis',
        riskAssessment: 'Health Risk Assessment',
        selectBodyParts: 'Click on body parts where you\'re experiencing symptoms',
        detectedSymptoms: 'Detected Symptoms',
        recommendations: 'Recommendations',
        disclaimer: 'This AI analysis is for informational purposes only and should not replace professional medical advice.'
      },
      // Appointments
      appointments: {
        schedule: 'Schedule Appointment',
        patientName: 'Patient Name',
        contactNumber: 'Contact Number',
        appointmentType: 'Appointment Type',
        preferredDate: 'Preferred Date',
        preferredTime: 'Preferred Time',
        reason: 'Reason for Visit',
        types: {
          general: 'General Consultation',
          followup: 'Follow-up Visit',
          routine: 'Routine Check-up',
          vaccination: 'Vaccination',
          labResults: 'Lab Results Review',
          referral: 'Specialist Referral'
        }
      },
      // Emergency
      emergency: {
        title: 'Emergency Information',
        call: 'Call Emergency Services',
        number: '911',
        symptoms: 'Emergency Symptoms',
        firstAid: 'First Aid Tips'
      }
    }
  },
  es: {
    translation: {
      // Navigation
      nav: {
        home: 'Inicio',
        dashboard: 'Panel',
        chat: 'Chat IA',
        doctors: 'Médicos',
        labTests: 'Análisis',
        profile: 'Perfil',
        settings: 'Configuración'
      },
      // Common
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        view: 'Ver',
        search: 'Buscar',
        filter: 'Filtrar',
        export: 'Exportar',
        import: 'Importar',
        next: 'Siguiente',
        previous: 'Anterior',
        submit: 'Enviar',
        reset: 'Restablecer'
      },
      // Homepage
      home: {
        title: 'Asistente Médico IA',
        subtitle: 'Tu compañero inteligente de salud',
        features: {
          chat: 'Chat de Salud IA',
          doctor: 'Consultas Médicas',
          labs: 'Reserva de Análisis',
          tracking: 'Seguimiento de Salud'
        }
      },
      // Dashboard
      dashboard: {
        title: 'Panel de Salud',
        subtitle: 'Seguimiento de tu viaje de salud y progreso',
        metrics: {
          appointments: 'Total de Citas',
          labTests: 'Análisis Completados',
          healthScore: 'Puntuación de Salud',
          streak: 'Días Consecutivos'
        }
      },
      // Chat
      chat: {
        title: 'Asistente de Salud IA',
        placeholder: 'Escribe tu pregunta de salud aquí...',
        disclaimer: 'Soy un asistente de IA, no un doctor. Consulta a un profesional de la salud para decisiones médicas.'
      }
      // Add more Spanish translations as needed
    }
  },
  fr: {
    translation: {
      // Navigation
      nav: {
        home: 'Accueil',
        dashboard: 'Tableau de bord',
        chat: 'Chat IA',
        doctors: 'Médecins',
        labTests: 'Tests de laboratoire',
        profile: 'Profil',
        settings: 'Paramètres'
      },
      // Common
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        view: 'Voir',
        search: 'Rechercher',
        filter: 'Filtrer',
        export: 'Exporter',
        import: 'Importer',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        reset: 'Réinitialiser'
      },
      // Homepage
      home: {
        title: 'Assistant Médical IA',
        subtitle: 'Votre compagnon de santé intelligent',
        features: {
          chat: 'Chat Santé IA',
          doctor: 'Consultations Médicales',
          labs: 'Réservation de Tests',
          tracking: 'Suivi de Santé'
        }
      }
      // Add more French translations as needed
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
  });

export default i18n;