import React, { useState } from 'react';
import axios from 'axios';
import WaveSeparatorInverted from '../common/WaveSeparatorInverted';

const ContactSection = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post('http://localhost:9090/api/v1/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); 
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  return (
    <section
      className="relative mt-[-20] pt-60 md:pt-80 pb-40 md:pb-60 bg-cover bg-no-repeat bg-center flex flex-col items-center justify-end overflow-hidden"
      style={{ backgroundImage: "url('/assets/images/contact-section-bg.png')" }}
    >
      
      {/*
      <div className="absolute top-0 left-0 w-full h-[20vh] md:h-[25vh] z-10">
        <WaveSeparatorInverted />
      </div>
      */}

      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <h2
        className="absolute left-[6.25rem] text-white z-20
                   font-bold text-[5rem] leading-none /* Converted 80px to 5rem, 100% line-height to leading-none */
                   /* You'll still need to fine-tune this 'top' value for exact placement across devices. */
                   top-[6rem] /* Converted 96px to 6rem */"
      >
        Contact
      </h2>

      <div
        className="relative z-40 mx-auto bg-white overflow-hidden flex flex-col md:flex-row
                   w-[75rem] h-[43.33rem] rounded-[0.8rem] /* Converted px to rem */
                   shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        style={{ bottom: '20%' }}
      >

        <div
          className="absolute w-[33.33rem] h-[33.33rem] rounded-[0.44rem]
                     top-[4.98rem] left-[4.33rem]"
          style={{ backgroundImage: "url('/assets/images/contact-section-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          
          <div
            className="absolute z-10 text-white shadow-lg flex flex-col justify-center
                       bg-[#101957] w-[22.57rem] h-[10.93rem] rounded-[0.53rem]
                       border-[0.53rem] border-white py-[1.87rem] px-[1.6rem]
                       top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="space-y-[1.33rem] text-left">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📞</span>
                <span className="text-base">+237 612 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <span className="text-base">contact@igniteacademy.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">📍</span>
                <span className="text-base">Emana, Yaounde, Cameroon</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bg-white p-8
                     w-[26.67rem] h-[33.33rem] min-w-[21.33rem] rounded-lg /* Converted px to rem, rounded-lg is 0.5rem */
                     top-[4.98rem] left-[44.2rem] /* Converted px to rem (707.2px / 16 = 44.2rem) */"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ex: Ignite Academy"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none rounded w-[23.47rem] h-[2.6rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                           py-2 px-4 border-t-[0.07rem] border-solid border-[#D9D9D9] /* Converted px to rem/standard Tailwind */"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ex: contact@igniteacademy.com"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none rounded w-[23.47rem] h-[2.6rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                           py-2 px-4 border-t-[0.07rem] border-solid border-[#D9D9D9] /* Converted px to rem/standard Tailwind */"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Objet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="L'objet de votre message"
                value={formData.subject}
                onChange={handleChange}
                className="shadow appearance-none rounded w-[23.47rem] h-[2.6rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                           py-2 px-4 border-t-[0.07rem] border-solid border-[#D9D9D9] /* Converted px to rem/standard Tailwind */"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Votre message"
                value={formData.message}
                onChange={handleChange}
                className="shadow appearance-none rounded w-[23.47rem] h-[5.33rem] min-h-[5.33rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                           py-2 px-4 border-t-[0.07rem] border-solid border-[#D9D9D9] /* Converted px to rem/standard Tailwind */"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#101957] hover:bg-[#3B4C8D] text-white font-bold focus:outline-none focus:shadow-outline
                         w-[23.47rem] h-[3.04rem] rounded-lg /* Converted px to rem, rounded-lg is 0.5rem */
                         py-2 px-2 /* Converted 8px padding to py-2 px-2 */
                         border-t-[0.07rem] border-solid border-[#101957]"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
          
          {status === 'success' && <p className="mt-4 text-green-500">Message envoyé avec succès !</p>}
          {status === 'error' && <p className="mt-4 text-red-500">Échec de l'envoi du message. Veuillez réessayer.</p>}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;