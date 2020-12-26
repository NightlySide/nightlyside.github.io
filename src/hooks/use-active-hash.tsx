import { useEffect, useState } from "react";

export const useActiveHash = (itemIds: string[], rootMargin = undefined) => {
  const [activeHash, setActiveHash] = useState(``);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(entry.target.id);
          }
        });
      },
      { rootMargin: rootMargin || `0% 0% -50% 0%` },
    );

    itemIds.forEach((id: string) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      itemIds.forEach((id: string) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return activeHash;
};
