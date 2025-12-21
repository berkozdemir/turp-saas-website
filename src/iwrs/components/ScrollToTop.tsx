// Dosya: src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Eğer linkte bir #id varsa (örn: #contact)
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        // Elemanın yüklenmesi için minik bir gecikme ile oraya kaydır
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Hash yoksa sayfanın en tepesine git
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;