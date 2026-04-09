// // import React from 'react'

// // const ShowcaseSection = () => {
// //   return (
// //     <div>ShowcaseSection</div>
// //   )
// // }

// // export default ShowcaseSection
// //in this module you can put your own project
// import { useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger);

// const AppShowcase = () => {
//   const sectionRef = useRef(null);
//   const rydeRef = useRef(null);
//   const libraryRef = useRef(null);
//   const ycDirectoryRef = useRef(null);

//   useGSAP(() => {
//     // Animation for the main section
//     gsap.fromTo(
//       sectionRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 2 }
//     );

//     // Animations for each app showcase
//     const cards = [rydeRef.current, libraryRef.current, ycDirectoryRef.current];

//     cards.forEach((card, index) => {
//       gsap.fromTo(
//         card,
//         {
//           y: 50,
//           opacity: 0,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 1,
//           delay: 0.3 * (index + 1),
//           scrollTrigger: {
//             trigger: card,
//             start: "top bottom-=100",
//           },
//         }
//       );
//     });
//   }, []);

//   return (
//     <div id="work" ref={sectionRef} className="app-showcase">
//       <div className="w-full">
//         <div className="showcaselayout">
//           <div ref={rydeRef} className="first-project-wrapper">
//             <div className="image-wrapper">
//               <img src="/images/projet1.png" alt="Ryde App Interface" />
//             </div>
//             <div className="text-content">
//               <h2>
//                 Imagify
//               </h2>
//               <p className="text-white-50 md:text-xl">
//                 A full-stack web application that generates high-quality images from text prompts using advanced AI models. Users can create accounts, purchase credits, and generate images based on their descriptions.
//               </p>
//             </div>
//           </div>

//           <div className="project-list-wrapper overflow-hidden">
//             <div className="project" ref={libraryRef}>
//               <div className="image-wrapper bg-[#FFEFDB]">
//                 <img
//                   src="/images/projet3.png"
//                   alt="Library Management Platform"
//                 />
//               </div>
//               <h2>Football Performance & Injury Prediction System</h2>
//             </div>

//             <div className="projet" ref={ycDirectoryRef}>
//               <div className="image-wrapper bg-[#FFE7EB]">
//                 <img src="/images/projet2.png" alt="YC Directory App" />
//               </div>
//               <h2>Smart Traffic Management</h2>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppShowcase;
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const libraryRef = useRef(null);
  const ycDirectoryRef = useRef(null);
  const ctaRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2 }
    );

    const cards = [rydeRef.current, libraryRef.current, ycDirectoryRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });

    // Animate CTA block
    gsap.fromTo(
      ctaRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top bottom-=80",
        },
      }
    );
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <img src="/images/projet1.png" alt="Ryde App Interface" />
            </div>
            <div className="text-content">
              <h2>Imagify</h2>
              <p className="text-white-50 md:text-xl">
                A full-stack web application that generates high-quality images
                from text prompts using advanced AI models. Users can create
                accounts, purchase credits, and generate images based on their
                descriptions.
              </p>
            </div>
          </div>

          <div className="project-list-wrapper">
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <img
                  src="/images/projet3.png"
                  alt="Library Management Platform"
                />
              </div>
              <h2>Football Performance & Injury Prediction System</h2>
            </div>

            <div className="project" ref={ycDirectoryRef}>
              <div className="image-wrapper bg-[#FFE7EB]">
                <img src="/images/projet2.png" alt="YC Directory App" />
              </div>
              <h2>Smart Traffic Management</h2>
            </div>
          </div>
        </div>

        {/* GitHub CTA Block */}
        <div ref={ctaRef} className="github-cta-wrapper">
          <a
            href="https://github.com/markpatel13"
            target="_blank"
            rel="noopener noreferrer"
            className="github-cta-block"
          >
            <div className="github-cta-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="github-icon"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="cta-text">
                Want to see more projects?{" "}
                <span className="cta-link-text">Visit my GitHub →</span>
              </span>
            </div>
            <div className="cta-shimmer" />
          </a>
        </div>
      </div>

      <style>{`
        .github-cta-wrapper {
          display: flex;
          justify-content: center;
          padding: 3rem 1.5rem 1rem;
        }

        .github-cta-block {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 720px;
          padding: 1.5rem 2.5rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #161616 0%, #1f1f1f 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-decoration: none;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .github-cta-block:hover {
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }

        .github-cta-block:hover .cta-shimmer {
          transform: translateX(100%);
        }

        .github-cta-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 1;
          position: relative;
        }

        .github-icon {
          color: #ffffff;
          flex-shrink: 0;
          opacity: 0.85;
        }

        .cta-text {
          font-size: 1.1rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.01em;
        }

        .cta-link-text {
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .cta-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.04),
            transparent
          );
          transition: transform 0.6s ease;
        }

        @media (max-width: 640px) {
          .github-cta-block {
            padding: 1.2rem 1.5rem;
          }
          .cta-text {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AppShowcase;
