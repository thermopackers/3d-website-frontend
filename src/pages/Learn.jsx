import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Recycle,
  Factory,
  Printer,
  Box,
  Package,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Leaf,
  Award,
  TrendingUp,
  Heart,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  Play,
  Info,
  FileText,
  BookOpen,
  GraduationCap,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Droplet,
  FlaskRound,
  Thermometer,
  Gauge,
  Waves
} from "lucide-react";

export default function Learn() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Process Steps Data with Images
  const processSteps = [
    {
      id: 1,
      icon: <Recycle className="w-8 h-8" />,
      title: "Plastic Collection",
      description: "Collect plastic waste from various sources including households, industries, and recycling centers.",
      image: "https://images.unsplash.com/photo-1710189605149-6cb6b81e5e9e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: [
        "PET bottles and containers",
        "HDPE plastic items",
        "LDPE plastic bags and wraps",
        "PP plastic materials",
        "3D printing waste and failed prints"
      ]
    },
    {
      id: 2,
      icon: <Factory className="w-8 h-8" />,
      title: "Sorting & Cleaning",
      description: "Sort plastics by type and color, then clean them to remove contaminants and labels.",
      image: "https://images.unsplash.com/photo-1613792962823-946490e6fbd7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: [
        "Manual sorting by type and color",
        "Washing to remove dirt and labels",
        "Drying and shredding into flakes",
        "Quality inspection and testing"
      ]
    },
    {
      id: 3,
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Plastic Recycling",
      description: "Process the cleaned plastic through mechanical recycling to create reusable plastic pellets.",
      image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: [
        "Melting and extrusion process",
        "Pelletizing into uniform granules",
        "Quality testing for consistency",
        "Color matching and additives"
      ]
    },
    {
      id: 4,
      icon: <Box className="w-8 h-8" />,
      title: "Filament Production & Injection Molding",
      description: "Convert recycled plastic pellets into high-quality 3D printing filament and injection molded products.",
      image: "https://images.unsplash.com/photo-1743056311244-5a4b8f195c26?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: [
        "Precise temperature control",
        "HDPE Injection Molding - Creating durable products like containers, pipes, and toys",
        "PET Filament Extrusion - Converting PET bottles into 3D printing filament",
        "Cooling and winding onto spools",
        "Diameter consistency checking (1.75mm or 2.85mm)"
      ],
      subDetails: [
        {
          title: "🔵 HDPE Injection Molding",
          icon: <Waves className="w-5 h-5" />,
          description: "HDPE (High-Density Polyethylene) is melted and injected into molds to create strong, durable products.",
          examples: "Bottles, containers, pipes, toys, and automotive parts",
          image: "https://images.unsplash.com/photo-1609862776364-897efc7dafdb?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          process: [
            "HDPE pellets are heated to 230-280°C",
            "Molten plastic is injected into molds under high pressure",
            "Cooled and solidified in seconds",
            "Ejected as finished products"
          ]
        },
        {
          title: "🟢 PET Filament 3D Printing",
          icon: <Printer className="w-5 h-5" />,
          description: "PET (Polyethylene Terephthalate) from water bottles is processed into high-quality 3D printing filament.",
          examples: "Strong, transparent, and food-safe 3D prints",
          image: "https://images.unsplash.com/photo-1581092335892-3a5b4b4b8f6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          process: [
            "PET flakes are dried and melted at 260-280°C",
            "Extruded through a nozzle to create filament",
            "Cooled in a water bath",
            "Wound onto spools with precise diameter control"
          ]
        }
      ]
    },
    {
      id: 5,
      icon: <Printer className="w-8 h-8" />,
      title: "3D Printing",
      description: "Use the recycled filament to create new products, bringing ideas to life.",
      image: "https://images.unsplash.com/photo-1609862776364-897efc7dafdb?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: [
        "3D modeling and slicing",
        "Layer-by-layer printing",
        "Post-processing and finishing",
        "Quality control and packaging"
      ]
    }
  ];

  // Recycling Methods
  const recyclingMethods = [
    {
      title: "Mechanical Recycling",
      icon: <Factory className="w-6 h-6" />,
      description: "The most common method where plastics are melted and reprocessed into new products.",
      steps: [
        "Shredding plastic into small pieces",
        "Washing and drying",
        "Melting and filtering",
        "Re-pelletizing into new plastic"
      ]
    },

  ];

  // Filament Types from Recycled Plastic
  const filamentTypes = [
    {
      name: "rPLA",
      description: "Recycled PLA filament - eco-friendly and biodegradable",
      properties: "Good print quality, low odor, eco-friendly",
      applications: "Prototypes, decorative items, packaging"
    },
    {
      name: "rPETG",
      description: "Recycled PETG filament - strong and durable",
      properties: "High strength, chemical resistance, good layer adhesion",
      applications: "Functional parts, containers, mechanical components"
    },
    {
      name: "rABS",
      description: "Recycled ABS filament - tough and impact-resistant",
      properties: "High impact resistance, heat resistance, durable",
      applications: "Automotive parts, electronic housings, tools"
    },
    {
      name: "rTPU",
      description: "Recycled TPU filament - flexible and elastic",
      properties: "High flexibility, wear resistance, rubber-like",
      applications: "Seals, gaskets, phone cases, flexible parts"
    }
  ];

  // Benefits of Plastic Recycling
  const benefits = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Reduces Plastic Pollution",
      description: "Keeps plastic waste out of landfills and oceans, protecting marine life and ecosystems."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Conserves Resources",
      description: "Reduces the need for virgin plastic production, saving petroleum and energy."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Circular Economy",
      description: "Creates a sustainable cycle where waste becomes valuable raw material."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Reduces Carbon Footprint",
      description: "Recycling plastic uses 70% less energy than producing new plastic from petroleum."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-blue-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-2000 opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
            >
              <span className="text-sm font-semibold text-white/90 tracking-widest uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learning Center
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              From Waste to <br />
              <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Wonder
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/80 max-w-3xl mx-auto"
            >
              Learn how plastic waste is transformed into valuable 3D printing materials
              and how you can be part of the circular economy.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('process').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-green-700 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                See the Process
              </button>
              <button
                onClick={() => document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <Leaf className="w-4 h-4" />
                Learn Benefits
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "60%", label: "Less Energy Used", icon: <Zap className="w-6 h-6 text-yellow-500" /> },
              { number: "70%", label: "Reduced CO2", icon: <Leaf className="w-6 h-6 text-green-500" /> },
              { number: "8M+", label: "Tons Recycled/Year", icon: <Recycle className="w-6 h-6 text-blue-500" /> },
              { number: "100%", label: "Sustainable Future", icon: <CheckCircle className="w-6 h-6 text-purple-500" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              The Complete <span className="text-green-600">Recycling</span> Process
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Follow the journey of plastic waste as it transforms into valuable 3D printing filament.
            </motion.p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-blue-500 hidden md:block"></div>

            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-12 md:mb-16 flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8`}
              >
                {/* Step Number Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:flex">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.id}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    {/* Image */}
                    <div className="mb-4 rounded-xl overflow-hidden h-48">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-green-100 rounded-xl text-green-600">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    <button
                      onClick={() => toggleSection(step.id)}
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      {expandedSection === step.id ? 'Hide details' : 'View details'}
                      {expandedSection === step.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedSection === step.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Sub-details for Step 4 - Filament Production & Injection Molding */}
                        {step.subDetails && (
                          <div className="mt-6 space-y-4">
                            <h4 className="font-semibold text-gray-900">Two Key Processes:</h4>
                            {step.subDetails.map((sub, idx) => (
                              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                  {sub.icon}
                                  <h5 className="font-semibold text-gray-900">{sub.title}</h5>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{sub.description}</p>
                                <div className="text-xs text-gray-500 mb-2">
                                  <span className="font-medium">Examples:</span> {sub.examples}
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Process:</p>
                                  <ul className="space-y-1">
                                    {sub.process.map((p, i) => (
                                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                        <ArrowRight className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span>{p}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recycling Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              <span className="text-green-600">Recycling</span> Methods
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Different approaches to transforming plastic waste into valuable resources.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            {recyclingMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="p-3 bg-green-100 rounded-xl w-fit text-green-600 mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <ul className="space-y-1.5">
                  {method.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                      <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filament Types */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Recycled <span className="text-green-600">Filament</span> Types
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              High-quality filaments made from recycled plastic materials.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filamentTypes.map((filament, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl text-white flex-shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{filament.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{filament.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-700">Properties:</span>
                        <span className="text-gray-600">{filament.properties}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-700">Applications:</span>
                        <span className="text-gray-600">{filament.applications}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Why Recycle <span className="text-green-600">Plastic</span>?
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6 rounded-full"
            />
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              The environmental and economic benefits of plastic recycling.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center group"
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Make a Difference?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              Start recycling your plastic waste today and earn rewards for your 3D printing needs.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate("/recycling")}
                className="px-8 py-3 bg-white text-green-700 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto sm:mx-0"
              >
                <Recycle className="w-5 h-5" />
                Start Recycling Now
              </button>
              <button
                onClick={() => navigate("/products")}
                className="px-8 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2 mx-auto sm:mx-0"
              >
                <Printer className="w-5 h-5" />
                Shop Recycled Products
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Beaker icon component (if not available in lucide-react)
const Beaker = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);