
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Certificate {
  name: string;
  issuer: string;
  date_issued: string;
  certificate_url: string;
  description: string;
}

const CertificatesForm = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      name: "",
      issuer: "",
      date_issued: "",
      certificate_url: "",
      description: ""
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Load existing certificates data
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('date_issued', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedData = data.map(cert => ({
            name: cert.name,
            issuer: cert.issuer,
            date_issued: cert.date_issued,
            certificate_url: cert.certificate_url || "",
            description: cert.description || ""
          }));
          setCertificates(formattedData);
        }
      } catch (error) {
        console.error('Error loading certificates:', error);
      }
    };

    loadCertificates();
  }, []);

  const addCertificate = () => {
    setCertificates([...certificates, {
      name: "",
      issuer: "",
      date_issued: "",
      certificate_url: "",
      description: ""
    }]);
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: string) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear existing certificates
      await supabase.from('certificates').delete().gte('id', '00000000-0000-0000-0000-000000000000');

      // Insert new certificates
      const certificatesToInsert = certificates
        .filter(cert => cert.name && cert.issuer && cert.date_issued)
        .map(cert => ({
          user_id: null, // Make it public
          name: cert.name,
          issuer: cert.issuer,
          date_issued: cert.date_issued,
          certificate_url: cert.certificate_url || null,
          description: cert.description || null
        }));

      if (certificatesToInsert.length > 0) {
        const { error } = await supabase.from('certificates').insert(certificatesToInsert);
        if (error) throw error;
      }

      alert('Certificates saved successfully!');
    } catch (error) {
      console.error('Error saving certificates:', error);
      alert('Error saving certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Certificates Management</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {certificates.map((cert, certIndex) => (
          <motion.div
            key={certIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Certificate {certIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeCertificate(certIndex)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                disabled={certificates.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Certificate Name"
                value={cert.name}
                onChange={(e) => updateCertificate(certIndex, 'name', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Issuer"
                value={cert.issuer}
                onChange={(e) => updateCertificate(certIndex, 'issuer', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Date Issued (e.g., 2024)"
                value={cert.date_issued}
                onChange={(e) => updateCertificate(certIndex, 'date_issued', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="Certificate URL (optional)"
                value={cert.certificate_url}
                onChange={(e) => updateCertificate(certIndex, 'certificate_url', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              placeholder="Description"
              value={cert.description}
              onChange={(e) => updateCertificate(certIndex, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addCertificate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Certificate
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Certificates'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificatesForm;
