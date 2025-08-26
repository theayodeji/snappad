import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div 
      className="w-full max-w-6xl h-max mx-auto mt-6 mb-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.7, 
            ease: "backInOut",
            when: "beforeChildren",
            staggerChildren: 0.2,
            delayChildren: 0.3
          }
        }
      }}
    >
      <div className="w-[90%] mx-auto md:h-[400px] h-[270px] p-8 bg-primary rounded-xl overflow-hidden relative flex flex-col items-center justify-center isolate">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-5xl md:leading-[150%] font-bold text-white text-center">
            Find Your{" "}
            <span className="text-black italic rounded-lg bg-tertiary">
              Next
            </span>{" "}
            Adventure
            <br />
            With homes that{" "}
            <span className="text-black italic rounded-lg bg-tertiary">
              fit{" "}
            </span>
            your style
          </h1>
        </div>
        <div className="hidden lg:block lg:absolute top-0 left-0 w-full h-full -z-10">
          <motion.img
            src="https://luxhabitat.ae/resizedimages/900w/15817/source/abc6d411f99fb22ef64cb47aa9248644e4587574718307a2772b2a893d6852a5.jpg"
            alt=""
            className="w-40 h-56 rounded-lg object-cover absolute left-18 -top-22 "
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "backOut" }}
          />
          <motion.img
            src="https://www.phgmag.com/wp-content/uploads/2024/05/GSS31_web-1024x682.jpg"
            alt=""
            className="w-52 h-28 rounded-lg object-cover absolute right-1/2 -top-2 translate-x-[50%]"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "backOut" }}
          />
          <motion.img
            src="https://luxhabitat.s3.ap-south-1.amazonaws.com/18432/786/1e7a758c39bfd2a17886d0196b46b0f92a5cf643e21ca3542cf0723b3628c69f.jpg"
            alt=""
            className="w-40 h-32 rounded-lg object-cover absolute left-8 bottom-10 "
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "backOut" }}
          />
          <motion.img
            src="https://www.thenordroom.com/wp-content/uploads/2020/03/industrial-scandinavian-loft-nordroom.jpg"
            alt=""
            className="w-52 h-40 rounded-lg object-cover absolute right-24 -bottom-10"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "backOut" }}
          />
          <motion.img
            src="https://chicagorentals.com/wp-content/uploads/2024/04/Condo-vs.-Apartment-Key-Differences.jpg"
            alt=""
            className="w-32 h-32 rounded-lg object-cover absolute right-24 top-10"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "backOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
