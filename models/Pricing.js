// Backend for Helix/models/Pricing.js
// This file centralizes your conference pricing structure.
const pricing = {
    hybrid: {
      academic: {
        "e-Poster": 199,
        "Poster Presentation": 349,
        "Video Presentation": 449,
        "Virtual Presentation": 599,
        "Oral Presentation": 899,
        "Delegate": 349,
        "Suit - A (OP + 2N stay)": 1199,
        "Suit - B (OP + 3N stay)": 1399,
        "Accompanying Person": 349,
        "Extra N-Stay": 249,
        "Article Publication": 1099,
        "Exhibitor": 3999,
      },
      business: {
        "e-Poster": 249,
        "Poster Presentation": 399,
        "Video Presentation": 499,
        "Virtual Presentation": 649,
        "Oral Presentation": 999,
        "Delegate": 399,
        "Suit - A (OP + 2N stay)": 1399,
        "Suit - B (OP + 3N stay)": 1599,
        "Accompanying Person": 499,
        "Extra N-Stay": 249,
        "Article Publication": 1299,
        "Exhibitor": 5999,
      }
    },
    webinar: {
      academic: {
        "e-Poster": 149,
        "Video Presentation": 399,
        "Virtual Presentation": 499,
        "Delegate": 349,
        "Article Publication": 1099,
        "Exhibitor": 1999,
      },
      business: {
        "e-Poster": 199,
        "Video Presentation": 499,
        "Virtual Presentation": 599,
        "Delegate": 449,
        "Article Publication": 1299,
        "Exhibitor": 2999,
      }
    }
  };
  
module.exports = pricing;