import { AnimatePresence, motion } from "framer-motion";

const PageTransition: React.FC<{
  children: React.ReactNode;
  path: string;
}> = (props) => {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={props.path}
        initial='initialState'
        animate='animateState'
        exit='exitState'
        className='page-transition'
        transition={{ duration: 0.1 }}
        variants={{
          initialState: {
            opacity: 0,
          },
          animateState: {
            opacity: 1,
          },
          exitState: {
            opacity: 0,
          },
        }}
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
