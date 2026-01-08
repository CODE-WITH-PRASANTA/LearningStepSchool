import React, { useEffect } from "react";
import "./PrivacyPolicyContent.css";

const sections = [
  {
    title: "Privacy Policy",
    content: [
      "Aenean ullamcorper est est, ac bibendum ipsum tincidunt vehicula. Nulla faucibus vulputate lorem, vitae placerat felis blandit ut. Nam sem quam, euismod sit amet augue et, mollis congue nisi.",
    ],
  },
  {
    title: "Collect Information",
    content: [
      "Donec ac pulvinar diam, ac mollis augue. Etiam interdum fringilla magna, at placerat libero malesuada sed. Proin tincidunt a sapien at facilisis.",
    ],
  },
  {
    title: "Usage of Information",
    content: [
      "Phasellus commodo venenatis erat, et vestibulum mi fringilla in. Proin elit urna, condimentum ut elit id, imperdiet rutrum orci.",
      "Suspendisse hendrerit ex sit amet augue lobortis ullamcorper.",
      "Nam ultrices mi mauris, eget tempus massa ornare id.",
    ],
  },
  {
    title: "Security Of User Data",
    list: [
      "Ut scelerisque hendrerit venenatis",
      "Proin fermentum lacus nec augue blandit placerat",
      "Ut vestibulum elit justo suscipit sem ultricies",
      "Integer fermentum vitae magna in condimentum",
      "Aenean ultrices neque id pellentesque tincidunt",
      "Donec ut vestibulum sem, in faucibus mauris",
    ],
  },
  {
    title: "Copyright and Security",
    content: [
      "Vestibulum bibendum metus quis purus sagittis ultricies. Vestibulum fringilla urna volutpat eros pharetra consectetur.",
    ],
  },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="privacy-wrapper">
      <div className="privacy-container">
        {sections.map((section, index) => (
          <div className="privacy-section" key={index}>
            <h2 className="reveal stagger">{section.title}</h2>

            {section.content &&
              section.content.map((text, i) => (
                <p
                  key={i}
                  className="reveal stagger"
                  style={{ transitionDelay: `${i * 0.15}s` }}
                >
                  {text}
                </p>
              ))}

            {section.list && (
              <ol className="privacy-list">
                {section.list.map((item, i) => (
                  <li
                    key={i}
                    className="reveal stagger"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    {item}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrivacyPolicy;
