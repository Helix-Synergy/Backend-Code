// // Backend for Helix/controllers/sourceController.js
// const { signToken, verifyToken } = require('../utils/jwt'); // Import your JWT utility functions

// // --- Standard Pricing Schemas (extracted from your images) ---
// const hybridPricingSchema = {
//     "e-Poster": { academic: 199.00, business: 249.00 },
//     "Poster Presentation": { academic: 349.00, business: 399.00 },
//     "Video Presentation": { academic: 449.00, business: 499.00 },
//     "Virtual Presentation": { academic: 599.00, business: 649.00 },
//     "Oral Presentation": { academic: 899.00, business: 999.00 },
//     "Delegate": { academic: 349.00, business: 399.00 },
//     "Suit - A (OP + 2N stay)": { academic: 1199.00, business: 1399.00 },
//     "Suit - B (OP + 3N stay)": { academic: 1399.00, business: 1599.00 },
//     "Add-Ons": {
//         "Accompanying Person": { academic: 349.00, business: 499.00 },
//         "Extra N-Stay": { academic: 249.00, business: 249.00 },
//         "Article Publication": { academic: 1099.00, business: 1299.00 },
//         "Exhibitor": { academic: 3999.00, business: 5999.00 }
//     }
// };

// const webinarPricingSchema = {
//     "e-Poster": { academic: 149.00, business: 199.00 },
//     "Video Presentation": { academic: 399.00, business: 499.00 },
//     "Virtual Presentation": { academic: 499.00, business: 599.00 },
//     "Delegate": { academic: 349.00, business: 449.00 },
//     "Add-Ons": {
//         "Article Publication": { academic: 1099.00, business: 1299.00 },
//         "Exhibitor": { academic: 1999.00, business: 2999.00 }
//     }
// };
// // --- END Standard Pricing Schemas ---


// // --- Allowed Sources (Event Metadata) ---
// const allowedSources = {
//     // Generic page registrations (ensure frontend sends these exact IDs)
//     "webinars_page": { name: "Webinar Collection", conferenceType: "webinar" }, // Frontend sends "webinars_page"
//     "hybrids_page": { name: "Hybrid Conferences Collection", conferenceType: "hybrid" }, // Assuming frontend sends "hybrids_page"

//     // 2025 Webinars (Matching frontend data exactly)
//     "IDOM-2025": { name: "International Conference on Dentistry & Oral Medicine", conferenceType: "webinar" },
//     "GENT-2025": { name: "Global Summit on Graphene and Nano Technology", conferenceType: "webinar" },
//     "ICAN-2025": { name: "International Conference on Autism and Neuropsychiatry", conferenceType: "webinar" },
//     "ARM-2025": { name: "Global Conclave on AI, Robotics, & Metaverse", conferenceType: "webinar" },
//     "WEST-2025": { name: "Global Women Empowerment & Sustainability Congress", conferenceType: "webinar" },
//     "NEST-2025": { name: "Global Summit on Nano Engineering & Smart Technology", conferenceType: "webinar" },

//     // 2026 Webinars (Upcoming) - CRITICAL: MATCH FRONTEND EXACTLY
//     "GENE-2026": { name: "World Gene Therapy Summit", conferenceType: "webinar" },
//     "STEM-2026": { name: "Global Stemcell Meet", conferenceType: "webinar" },
//     "IMMUNO-2026": { name: "International Immunotherapy Conclave", conferenceType: "webinar" },
//     "IBS-2026": { name: "International Biosensors Summit", conferenceType: "webinar" },
//     "BATTERY-2026": { name: "Global Battery Tech Summit", conferenceType: "webinar" },
//     "BIOELECTRONICS-2026": { name: "World Bioelectronics Conclave", conferenceType: "webinar" },
//     "VACCINE-2026": { name: "Global Vaccine Technology Summit", conferenceType: "webinar" },
//     "GENOMICS-2026": { name: "World Genomics Conclave", conferenceType: "webinar" },
//     "GPS-2026-WEBINAR": { name: "Global Proteomics Summit", conferenceType: "webinar" }, // This should be correct for webinar now
//     "BIGDATA-2026": { name: "Global Bigdata Summit", conferenceType: "webinar" },
//     "DATAANALYTICS-2026": { name: "World Data Analytics Conclave", conferenceType: "webinar" },
//     "BLOCKCHAIN-2026": { name: "Global Block Chain Summit", conferenceType: "webinar" },
//     "GREEN-2026": { name: "Global Green Chemistry Conclave", conferenceType: "webinar" },
//     "BIOFUEL-2026": { name: "World Biofuels Conclave", conferenceType: "webinar" },
//     "FERMENTATION-2026": { name: "Global Fermentation Technology Summit", conferenceType: "webinar" },
//     "FOOD-2026": { name: "World Symposia on Food Chemistry", conferenceType: "webinar" },
//     "RENEWABLE-2026": { name: "World Renewable Energy Conclave", conferenceType: "webinar" },
//     "HYDROGEN-2026": { name: "Global Green Hydrogen Summit", conferenceType: "webinar" },
//     "QUANTUM-2026": { name: "International Quantum Computing Conclave", conferenceType: "webinar" },
//     "BIOMECHANICS-2026": { name: "Global Biomechanics Summit", conferenceType: "webinar" },
//     "CYBER-2026": { name: "Global Cybersecurity Summit", conferenceType: "webinar" },
//     "META-2026": { name: "Global Symposia on Metaverse", conferenceType: "webinar" },
//     "MACHINELEARNING-2026": { name: "International Machine Learning Summit", conferenceType: "webinar" },
//     "AR-2026": { name: "Global Conclave on Augmented Reality", conferenceType: "webinar" },
//     "NEST-2026": { name: "Global Summit on Nano Engineering & Smart Technology", conferenceType: "webinar" },
//     "NANO-2026": { name: "World Nano Summit", conferenceType: "webinar" },
//     "IGC-2026": { name: "International Graphene Conclave", conferenceType: "webinar" },
//     "CLOUD-2026": { name: "International Conference on Cloud Computing", conferenceType: "webinar" },
//     "AIR-2026": { name: "International Artificial Intelligence & Robotics Conclave", conferenceType: "webinar" },
//     "AEROTECH-2026": { name: "Global Aerospace Engineering Conclave", conferenceType: "webinar" },


//     // 2025 Hybrid Events (Matching frontend data if applicable)
//     "FOODMEET-2025": { name: "World Agriculture & Food Sciences Conclave", conferenceType: "hybrid" },
//     "TECHMATICS-2025": { name: "International Science & Technology Summit", conferenceType: "hybrid" },
//     "PHARMATECH-2025": { name: "Global Pharmaceutical Conclave", conferenceType: "hybrid" },
//     "BIOCON-2025": { name: "World Biotechnology Summit", conferenceType: "hybrid" },
//     "MEDICLAVE-2025": { name: "Global Medical Conclave", conferenceType: "hybrid" },
//     "PUBLICHEALTH-2025": { name: "International Conferences On Public Health & Nursing", conferenceType: "hybrid" },
//     "GBS-2025": { name: "Global Bioinformatics Summit", conferenceType: "hybrid" },
//     "HEALTH SCIENCES-2025": { name: "International Health Sciences Conclave", conferenceType: "hybrid" }, // CHANGED: Added space


//     // 2026 Hybrid Events (Upcoming) - CRITICAL: MATCH FRONTEND EXACTLY
//     "PHARMAMEET-2026": { name: "International Pharmaceutical Summit", conferenceType: "hybrid" },
//     "PHARMACY-2026": { name: "World Pharmacy Conclave", conferenceType: "hybrid" },
//     "NURSING-2026": { name: "World Nursing Summit", conferenceType: "hybrid" },
//     "SURGICAL NURSING-2026": { name: "World Medical-Surgical Nursing Summit", conferenceType: "hybrid" }, // CHANGED: Added space
//     "CRITICAL CARE-2026": { name: "International Critical Care Nursing Conclave", conferenceType: "hybrid" }, // CHANGED: Added space
//     "ENVIRONMENTAL CHEMISTRY-2026": { name: "World Summit on Environmental Chemistry", conferenceType: "hybrid" }, // CHANGED: Added space
//     "BIOCHEMISTRY-2026": { name: "International Conferences on Biochemistry", conferenceType: "hybrid" },
//     "ICC-2026": { name: "International Chemistry Conclave", conferenceType: "hybrid" },
//     "MEDICLAVE-2026": { name: "Global Medical Conclave", conferenceType: "hybrid" },
//     "Environmental Medicine-2026": { name: "World Environmental Medicine Summit", conferenceType: "hybrid" }, // CHANGED: Added space and adjusted casing
//     "FOODMEET-2026": { name: "World Agriculture & Food Sciences Conclave", conferenceType: "hybrid" },
//     "AGRITECH-2026": { name: "Global Agricultural Technology Conclave", conferenceType: "hybrid" },
//     "FOODTECH-2026": { name: "International Food Technology Congress", conferenceType: "hybrid" },
//     "GPS-2026": { name: "Global Physics Summit", conferenceType: "hybrid" }, // CHANGED: To match frontend request for hybrid
//     "MATERIAL SCIENCES-2026": { name: "International Material Sciences Summit", conferenceType: "hybrid" }, // CHANGED: Added space
//     "EARTH SCIENCES-2026": { name: "World Earth Science Summit", conferenceType: "hybrid" }, // CHANGED: Added space
//     "TECHMATICS-2026": { name: "International Science & Technology Summit", conferenceType: "hybrid" },
//     "BIOMED-2026": { name: "International Conferences on Biomedical Engineering", conferenceType: "hybrid" },
//     "INDUSTRIAL ENGINEERING-2026": { name: "World Summit on Industrial Engineering", conferenceType: "hybrid" }, // CHANGED: Added space
//     "NANOTECHNOLOGY-2026": { name: "Global Nanotechnology Summit", conferenceType: "hybrid" },
//     "NANOMATERIALS-2026": { name: "International Nanomaterials Conclave", conferenceType: "hybrid" },
//     "NANOMEDICINE-2026": { name: "World Nanomedicine Summit", conferenceType: "hybrid" },
//     "WBC-2026": { name: "World Biofuel Congress", conferenceType: "hybrid" },
//     "IBC-2026": { name: "International Biotechnology Conclave", conferenceType: "hybrid" },
//     "STEMCELL-2026": { name: "Global Stem Cell & Regenerative Medicine Summit", conferenceType: "hybrid" },
//     "AI-HEALTHCARE-2026": { name: "World Summit on Artificial Intelligence in Healthcare", conferenceType: "hybrid" },
//     "CLIMATE-2026": { name: "International Conferences on Climate Engineering", conferenceType: "hybrid" },
//     "FORENSICS-2026": { name: "Global Conclave on Forensic Sciences", conferenceType: "hybrid" },
// };
// // --- END Allowed Sources ---


// // Helper function to get specific details including pricing based on conference type
// const getConferenceSpecificDetails = (sourceId, conferenceType) => {
//     const source = allowedSources[sourceId];

//     let pricingPlans = {};
//     let conferenceName = `Unknown ${conferenceType.charAt(0).toUpperCase() + conferenceType.slice(1)} Event`;

//     if (source) {
//         conferenceName = source.name;
//         if (source.conferenceType === 'hybrid') {
//             pricingPlans = hybridPricingSchema;
//         } else if (source.conferenceType === 'webinar') {
//             pricingPlans = webinarPricingSchema;
//         }
//     } else {
//         // Fallback for generic page IDs or unlisted sources (should ideally match allowedSources for generic pages)
//         if (conferenceType === 'hybrid') {
//             pricingPlans = hybridPricingSchema;
//             conferenceName = "Hybrid Conferences";
//         } else if (conferenceType === 'webinar') {
//             pricingPlans = webinarPricingSchema;
//             conferenceName = "Webinar Conferences";
//         }
//     }

//     return {
//         conferenceName: conferenceName,
//         pricingPlans: pricingPlans
//     };
// };


// // Controller function to generate a source token
// exports.generateSourceToken = (req, res) => {
//     const { sourceId, conferenceType } = req.query; // Already changed, good

//     if (!sourceId || !conferenceType) {
//         return res.status(400).json({ message: 'sourceId and conferenceType are required.' });
//     }

//     // Basic validation: Check if sourceId is recognized
//     if (!allowedSources[sourceId]) {
//         console.warn(`Attempted to generate token for unauthorized or unknown sourceId: ${sourceId}`);
//         return res.status(403).json({ message: 'Unauthorized source or event code.' });
//     }

//     // Optional: Validate if the provided conferenceType matches the configured type for that sourceId
//     // CRITICAL: Ensure frontend sends lowercase 'hybrid' or 'webinar'
//     if (allowedSources[sourceId].conferenceType && allowedSources[sourceId].conferenceType !== conferenceType) {
//         console.warn(`Mismatched conferenceType for sourceId ${sourceId}: Expected ${allowedSources[sourceId].conferenceType}, got ${conferenceType}`);
//         // For strictness, you might change this to:
//         return res.status(403).json({ message: 'Conference type mismatch for source.' });
//     }

//     try {
//         // Create the payload for the JWT
//         const payload = {
//             sourceId: sourceId,
//             conferenceType: conferenceType
//         };

//         // Use your existing signToken utility
//         const token = signToken(payload, '10m'); // Token expires in 10 minutes (adjust as needed)

//         res.json({ token });

//     } catch (error) {
//         console.error('Error in generateSourceToken:', error.message);
//         res.status(500).json({ message: 'Failed to generate token due to server error.' });
//     }
// };

// // Controller function to verify a source token
// exports.verifySourceToken = (req, res) => {
//     const token = req.query.token || req.body.token; // Allow token in query or body

//     if (!token) {
//         return res.status(400).json({ message: 'Token is required.' });
//     }

//     try {
//         // Use your existing verifyToken utility
//         const decoded = verifyToken(token);

//         if (!decoded) {
//             return res.status(401).json({ message: 'Invalid or expired token.' });
//         }

//         const { sourceId, conferenceType } = decoded;

//         // Basic validation: Ensure the decoded sourceId is in our allowed list
//         if (!allowedSources[sourceId]) {
//             return res.status(403).json({ message: 'Decoded sourceId is not recognized or authorized.' });
//         }

//         // Fetch additional details for the registration page from our schemas
//         const details = getConferenceSpecificDetails(sourceId, conferenceType);

//         res.json({
//             isValid: true,
//             sourceId: sourceId,
//             conferenceType: conferenceType,
//             conferenceName: details.conferenceName,
//             pricingPlans: details.pricingPlans
//         });

//     } catch (error) {
//         console.error('Error in verifySourceToken:', error.message);
//         // More specific error messages for frontend
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: 'Token expired. Please navigate from the event page again.' });
//         }
//         return res.status(401).json({ message: 'Invalid or malformed token.' });
//     }
// };







// Backend for Helix/controllers/sourceController.js
const { signToken, verifyToken } = require('../utils/jwt');

// --- Centralized Pricing Data ---
// This structure holds year-specific pricing for each plan and its add-ons
// You MUST populate this with your actual conference plans, features, and add-ons for each year.
const conferencePricingData = {
  // Hybrid Conferences
  "hybrid": {
    "2025": [ // 2025 Prices
      {
        planId: "hybrid_e_poster_2025",
        name: "E-Poster Presentation",
        basePrice: 139.00,
        features: [
          "Digital e-poster Display",
          "Abstract in Conference Proceedings",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_poster_2025",
        name: "Poster Presentation",
        basePrice: 239.00,
        features: [
          "Boost your Profile",
          "Networking",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_video_2025",
        name: "Video Presentation",
        basePrice: 289.00,
        features: [
          "10-15 minutes Video Slot",
          "Online Access for 1 hour",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_virtual_2025",
        name: "Virtual Presentation",
        basePrice: 389.00,
        features: [
          "Online Slot for 20 minutes",
          "Global Networking",
          "Promotions",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_oral_2025",
        name: "Oral Presentation",
        basePrice: 889.00,
        features: [
          "Keynote Slot Eligibility",
          "Promotions",
          "Conference Kit",
          "Networking Access"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_delegate_2025",
        name: "Delegate Access",
        basePrice: 329.00,
        features: [
          "Access to all sessions",
          "Conference Handbook",
          "Coffee Break & Lunch",
          "Networking Opportunities"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_suit_a_2025",
        name: "Suit - A (OP + 2N stay)",
        basePrice: 1189.00,
        features: [
          "Oral Presentation",
          "2 Night’s Accommodation",
          "Shuttle Service",
          "Certificate & Promotions",
          "Queen Size Room"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_suit_b_2025",
        name: "Suit - B (OP + 3N stay)",
        basePrice: 1389.00,
        features: [
          "Oral Presentation",
          "3 Night’s Accommodation",
          "Shuttle Service",
          "Certificate & Promotions",
          "Queen Size Room"
        ],
        addOns: [
          { id: "accom_person_2025", name: "Accompanying Person", price: 199.00, perAttendee: true },
          { id: "extra_n_stay_2025", name: "Extra Night Stay", price: 189.00, perAttendee: false },
          { id: "article_pub_2025", name: "Article Publication (Additional)", price: 1089.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_exhibitor_2025",
        name: "Exhibitor Booth",
        basePrice: 2089.00,
        features: [
          "Brand Exposure",
          "Product Showcasing",
          "Partnership Potential",
          "Logo in Conference Proceedings",
          "Promoting Globally"
        ],
        addOns: []
      }
    ],
    "2026": [ // 2026 Prices
      {
        planId: "hybrid_e_poster_2026",
        name: "E-Poster Presentation",
        basePrice: 199.00,
        features: [
          "Digital e-poster Display",
          "Abstract in Conference Proceedings",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_poster_2026",
        name: "Poster Presentation",
        basePrice: 349.00,
        features: [
          "Boost your Profile",
          "Networking",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_video_2026",
        name: "Video Presentation",
        basePrice: 449.00,
        features: [
          "10-15 minutes Video Slot",
          "Online Access for 1 hour",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_virtual_2026",
        name: "Virtual Presentation",
        basePrice: 599.00,
        features: [
          "Online Slot for 20 minutes",
          "Global Networking",
          "Promotions",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_oral_2026",
        name: "Oral Presentation",
        basePrice: 899.00,
        features: [
          "Keynote Slot Eligibility",
          "Promotions",
          "Conference Kit",
          "Networking Access"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_delegate_2026",
        name: "Delegate Access",
        basePrice: 349.00,
        features: [
          "Access to all sessions",
          "Conference Handbook",
          "Coffee Break & Lunch",
          "Networking Opportunities"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_suit_a_2026",
        name: "Suit - A (OP + 2N stay)",
        basePrice: 1199.00,
        features: [
          "Oral Presentation",
          "2 Night’s Accommodation",
          "Shuttle Service",
          "Certificate & Promotions",
          "Queen Size Room"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_suit_b_2026",
        name: "Suit - B (OP + 3N stay)",
        basePrice: 1399.00,
        features: [
          "Oral Presentation",
          "3 Night’s Accommodation",
          "Shuttle Service",
          "Certificate & Promotions",
          "Queen Size Room"
        ],
        addOns: [
          { id: "accom_person_2026", name: "Accompanying Person", price: 349.00, perAttendee: true },
          { id: "extra_n_stay_2026", name: "Extra Night Stay", price: 249.00, perAttendee: false },
          { id: "article_pub_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "hybrid_exhibitor_2026",
        name: "Exhibitor Booth",
        basePrice: 3999.00,
        features: [
          "Brand Exposure",
          "Product Showcasing",
          "Partnership Potential",
          "Logo in Conference Proceedings",
          "Promoting Globally"
        ],
        addOns: []
      }
    ]
  },
  // Webinar Conferences
  "webinar": {
    "2025": [ // 2025 Prices
      {
        planId: "webinar_e_poster_2025",
        name: "E-Poster Presentation",
        basePrice: 129.00,
        features: [
          "Digital e-poster Display",
          "Abstract in Conference Proceedings",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "article_pub_webinar_2025", name: "Article Publication (Additional)", price: 989.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_video_2025",
        name: "Video Presentation",
        basePrice: 289.00,
        features: [
          "10-15 minutes Video Slot",
          "Online Access for 1 hour",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "article_pub_webinar_2025", name: "Article Publication (Additional)", price: 989.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_virtual_2025",
        name: "Virtual Presentation",
        basePrice: 389.00,
        features: [
          "Online Slot for 20 minutes",
          "Global Networking",
          "Promotions",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "article_pub_webinar_2025", name: "Article Publication (Additional)", price: 989.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_delegate_2025",
        name: "Delegate Access",
        basePrice: 149.00,
        features: [
          "Access to all sessions",
          "Conference Handbook",
          "Coffee Break & Lunch",
          "Networking Opportunities"
        ],
        addOns: [
          { id: "article_pub_webinar_2025", name: "Article Publication (Additional)", price: 989.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_exhibitor_2025",
        name: "Virtual Exhibitor Booth",
        basePrice: 1089.00,
        features: [
          "Brand Exposure",
          "Product Showcasing",
          "Partnership Potential",
          "Logo in Conference Proceedings",
          "Promoting Globally"
        ],
        addOns: []
      }
    ],
    "2026": [ // 2026 Prices
      {
        planId: "webinar_e_poster_2026",
        name: "E-Poster Presentation",
        basePrice: 149.00,
        features: [
          "Digital e-poster Display",
          "Abstract in Conference Proceedings",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "article_pub_webinar_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_video_2026",
        name: "Video Presentation",
        basePrice: 399.00,
        features: [
          "10-15 minutes Video Slot",
          "Online Access for 1 hour",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "article_pub_webinar_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_virtual_2026",
        name: "Virtual Presentation",
        basePrice: 499.00,
        features: [
          "Online Slot for 20 minutes",
          "Global Networking",
          "Promotions",
          "Certificate of Presentation"
        ],
        addOns: [
          { id: "article_pub_webinar_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_delegate_2026",
        name: "Delegate Access",
        basePrice: 349.00,
        features: [
          "Access to all sessions",
          "Conference Handbook",
          "Coffee Break & Lunch",
          "Networking Opportunities"
        ],
        addOns: [
          { id: "article_pub_webinar_2026", name: "Article Publication (Additional)", price: 1099.00, perAttendee: false }
        ]
      },
      {
        planId: "webinar_exhibitor_2026",
        name: "Virtual Exhibitor Booth",
        basePrice: 1999.00,
        features: [
          "Brand Exposure",
          "Product Showcasing",
          "Partnership Potential",
          "Logo in Conference Proceedings",
          "Promoting Globally"
        ],
        addOns: []
      }
    ]
  }
};
// --- END Centralized Pricing Data ---


// --- Allowed Sources (Event Metadata) ---
// CRITICAL: Ensure these IDs match exactly what your frontend sends when generating tokens
const allowedSources = {
    // Generic page registrations (ensure frontend sends these exact IDs)
    "webinars_page": { name: "Webinar Collection", conferenceType: "webinar" },
    "hybrids_page": { name: "Hybrid Conferences Collection", conferenceType: "hybrid" },

    // 2025 Webinars (Matching frontend data exactly)
    "IDOM-2025": { name: "International Conference on Dentistry & Oral Medicine", conferenceType: "webinar" },
    "GENT-2025": { name: "Global Summit on Graphene and Nano Technology", conferenceType: "webinar" },
    "ICAN-2025": { name: "International Conference on Autism and Neuropsychiatry", conferenceType: "webinar" },
    "ARM-2025": { name: "Global Conclave on AI, Robotics, & Metaverse", conferenceType: "webinar" },
    "WEST-2025": { name: "Global Women Empowerment & Sustainability Congress", conferenceType: "webinar" },
    "NEST-2025": { name: "Global Summit on Nano Engineering & Smart Technology", conferenceType: "webinar" },

    // 2026 Webinars (Upcoming) - CRITICAL: MATCH FRONTEND EXACTLY
    "GHS-2026": { name: "Global Health Summit", conferenceType: "webinar" },
    "Emergency-2026": { name: "International Conference on Emergency Medicine & Trauma", conferenceType: "webinar" },
    "Stroke-2026": { name: "World Stroke & Care Congress", conferenceType: "webinar" },
    "Agrisummit-2026": { name: "International Conference on Food, Agriculture & Environmental Sciences", conferenceType: "webinar" },
    "Bioteck-2026": { name: "Global Congress on Plant Biology & Biotechnology", conferenceType: "webinar" },
    "Genomics-2026": { name: "International Genomics & Molecular Biology Summit", conferenceType: "webinar" },
    "Scitech-2026": { name: "International Conference on Advances in Science, Engineering & Technology", conferenceType: "webinar" },
    "Matsciences-2026": { name: "International Conference on Materials Science & Engineering", conferenceType: "webinar" },
    "AIML-2026": { name: "International Conference on Artificial Intelligence & Machine Learning", conferenceType: "webinar" },
    "Drug-2026": { name: "Symposium on Drug Design & Pharmaceutical Sciences", conferenceType: "webinar" },
    "Pharmacology-2026": { name: "World Congress on Pharmacology & Future Therapies", conferenceType: "webinar" },
    "Clinicaltrials-2026": { name: "Global Summit on Pharmacovigilance & Clinical Trials", conferenceType: "webinar" },

    // 2025 Hybrid Events (Matching frontend data if applicable)
    "FOODMEET-2025": { name: "World Agriculture & Food Sciences Conclave", conferenceType: "hybrid" },
    "TECHMATICS-2025": { name: "International Science & Technology Summit", conferenceType: "hybrid" },
    "PHARMATECH-2025": { name: "Global Pharmaceutical Conclave", conferenceType: "hybrid" },
    "BIOCON-2025": { name: "World Biotechnology Summit", conferenceType: "hybrid" },
    "MEDICLAVE-2025": { name: "Global Medical Conclave", conferenceType: "hybrid" },
    "PUBLICHEALTH-2025": { name: "International Conferences On Public Health & Nursing", conferenceType: "hybrid" },
    // "GBS-2025": { name: "Global Bioinformatics Summit", conferenceType: "hybrid" }, // Removed from 2026 data, so commenting out for consistency
    "HEALTH SCIENCES-2025": { name: "International Health Sciences Conclave", conferenceType: "hybrid" },

    // 2026 Hybrid Events (Upcoming) - CRITICAL: MATCH FRONTEND EXACTLY
    "Healthcare-2026": { name: "World Healthcare Summit", conferenceType: "hybrid" },
    "Antibiotics-2026": { name: "World Congress on Infectious Diseases & Antibiotics", conferenceType: "hybrid" },
    "Cardiology-2026": { name: "International Conference on Cardiology", conferenceType: "hybrid" },
    "Cancer-2026": { name: "Global Summit on Cancer & Research", conferenceType: "hybrid" },
};
// --- END Allowed Sources ---


// Helper function to get specific details including pricing based on conference type AND YEAR
const getConferenceSpecificDetails = (sourceId, conferenceType, conferenceYear) => {
    const source = allowedSources[sourceId];
    let conferenceName = `Unknown ${conferenceType.charAt(0).toUpperCase() + conferenceType.slice(1)} Event`;
    let pricingPlansForFrontend = []; // This will be the array of plans

    if (source) {
        conferenceName = source.name;
    } else {
        // Fallback for generic page IDs or unlisted sources
        if (conferenceType === 'hybrid') {
            conferenceName = "Hybrid Conferences";
        } else if (conferenceType === 'webinar') {
            conferenceName = "Webinar Conferences";
        }
    }

    // Retrieve the specific pricing plans for the given type and year
    if (conferencePricingData[conferenceType] && conferencePricingData[conferenceType][conferenceYear]) {
        pricingPlansForFrontend = conferencePricingData[conferenceType][conferenceYear];
    } else {
        console.warn(`No pricing data found for type: ${conferenceType}, year: ${conferenceYear}. Returning empty plans.`);
        // In a real application, you might want to return an error or default plans,
        // or ensure all years/types are covered.
    }

    return {
        conferenceName: conferenceName,
        pricingPlans: pricingPlansForFrontend // Return the array of plans
    };
};


// Controller function to generate a source token
exports.generateSourceToken = (req, res) => {
    const { sourceId, conferenceType, conferenceYear } = req.query; // Ensure conferenceYear is received

    if (!sourceId || !conferenceType || !conferenceYear) {
        return res.status(400).json({ message: 'sourceId, conferenceType, and conferenceYear are required.' });
    }

    if (!allowedSources[sourceId]) {
        console.warn(`Attempted to generate token for unauthorized or unknown sourceId: ${sourceId}`);
        return res.status(403).json({ message: 'Unauthorized source or event code.' });
    }

    if (allowedSources[sourceId].conferenceType && allowedSources[sourceId].conferenceType !== conferenceType) {
        console.warn(`Mismatched conferenceType for sourceId ${sourceId}: Expected ${allowedSources[sourceId].conferenceType}, got ${conferenceType}`);
        return res.status(403).json({ message: 'Conference type mismatch for source.' });
    }

    try {
        const payload = {
            sourceId: sourceId,
            conferenceType: conferenceType,
            conferenceYear: conferenceYear // Include conferenceYear in the JWT payload!
        };
        const token = signToken(payload, '10m'); // Token expires in 10 minutes (adjust as needed)
        res.json({ token });

    } catch (error) {
        console.error('Error in generateSourceToken:', error.message);
        res.status(500).json({ message: 'Failed to generate token due to server error.' });
    }
};

// Controller function to verify a source token
exports.verifySourceToken = (req, res) => {
    const token = req.query.token || req.body.token; // Allow token in query or body

    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }

    try {
        // Use your existing verifyToken utility
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        const { sourceId, conferenceType, conferenceYear } = decoded; // Extract conferenceYear from decoded token

        // Basic validation: Ensure the decoded sourceId is in our allowed list
        if (!allowedSources[sourceId]) {
            return res.status(403).json({ message: 'Decoded sourceId is not recognized or authorized.' });
        }

        // Fetch additional details for the registration page from our schemas
        // Pass conferenceYear to get specific pricing plans
        const details = getConferenceSpecificDetails(sourceId, conferenceType, conferenceYear);

        res.json({
            isValid: true,
            sourceId: sourceId,
            conferenceType: conferenceType,
            conferenceYear: conferenceYear, // Return conferenceYear to frontend
            conferenceName: details.conferenceName,
            pricingPlans: details.pricingPlans // This will now be the array of plans as per detailed flow
        });

    } catch (error) {
        console.error('Error in verifySourceToken:', error.message);
        // More specific error messages for frontend
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please navigate from the event page again.' });
        }
        return res.status(401).json({ message: 'Invalid or malformed token.' });
    }
};