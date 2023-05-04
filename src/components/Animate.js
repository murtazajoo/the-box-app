import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageLayout = ({ children }) => children;

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "linear",
  duration: 0.5,
};

export default function AnimationLayout() {
  const { pathname } = useLocation();
  return (
    <PageLayout>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.div>
    </PageLayout>
  );
}
