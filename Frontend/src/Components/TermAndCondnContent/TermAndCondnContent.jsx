import React, { useEffect } from "react";
import "./TermAndCondnContent.css";

const policySections = [
  {
    title: "Our Performance",
    content: [
      "Sed ac sollicitudin ipsum. Vivamus vulputate, enim sit amet aliquet lacinia, ex mauris aliquam elit, vel pharetra augue arcu ultricies magna.",
      "Suspendisse justo erat, dignissim ut imperdiet ut, convallis vitae urna. Vivamus tincidunt lacinia metus sed suscipit.",
    ],
  },
  {
    title: "Cookie",
    content: [
      "Pellentesque sit amet nulla facilisis, lobortis ex at, consequat diam. Pellentesque sed dui lorem. Aliquam vel euismod nunc.",
    ],
  },
  {
    title: "Payments",
    content: [
      "Amet nulla facilisis, lobortis ex at, consequat diam. Pellentesque sed dui lorem. Aliquam vel euismod nunc.",
    ],
  },
  {
    title: "Refund Policy",
    content: [
      "Donec ut vestibulum sem, in faucibus mauris. Nulla et luctus nulla. Vestibulum consectetur nisi nec lobortis pretium.",
      "Proin non ante purus. Donec ante enim, semper vel mauris at, rutrum blandit mauris.",
    ],
  },
  {
    title: "Hyperlinking to our Content",
    content: [
      "Sed ac sollicitudin ipsum vivamus vulputate enim sit amet aliquet lacinia mauris aliquam elit:",
    ],
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
    title: "Disclaimer",
    content: [
      "Donec facilisis consequat nisi. Vivamus euismod at ipsum a gravida. Quisque vitae augue maximus elit iaculis tincidunt.",
    ],
  },
];

const PolicyPage = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

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

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="policy-wrapper">
      <div className="policy-container">
        {policySections.map((section, index) => (
          <div className="policy-section" key={index}>
            <h2 className="reveal stagger">{section.title}</h2>

            {section.content?.map((text, i) => (
              <p
                key={i}
                className="reveal stagger"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {text}
              </p>
            ))}

            {section.list && (
              <ol className="policy-list">
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

export default PolicyPage;
