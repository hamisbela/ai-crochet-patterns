import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Scissors, ImageIcon, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default crochet image path
const DEFAULT_IMAGE = "/default-crochet.jpg";

// Default analysis for the crochet pattern
const DEFAULT_ANALYSIS = `1. Pattern Information:
- Name: Simple Circular Crochet Coaster
- Difficulty Level: Beginner
- Approximate Size: 4.5 inches (11.5 cm) in diameter
- Time to Complete: 30-45 minutes

2. Materials Needed:
- Yarn: Medium weight (worsted/category 4) cotton yarn in white
- Hook Size: H/8 (5.0 mm)
- Notions: Yarn needle for weaving in ends
- Yardage: Approximately 20-25 yards (18-23 meters)

3. Abbreviations:
- ch: chain
- sc: single crochet
- sl st: slip stitch
- st(s): stitch(es)
- rnd: round
- inc: increase (2 stitches in same stitch)

4. Gauge:
- 3.5 sc = 1 inch (2.5 cm)
- Not critical for this project

5. Pattern Instructions:
- Foundation: Ch 4, sl st to first ch to form a ring.
- Round 1: Ch 1 (does not count as a stitch), 8 sc into the ring, sl st to first sc to join. (8 sts)
- Round 2: Ch 1, 2 sc in each st around, sl st to first sc to join. (16 sts)
- Round 3: Ch 1, *1 sc in first st, 2 sc in next st; repeat from * around, sl st to first sc to join. (24 sts)
- Round 4: Ch 1, *1 sc in each of first 2 sts, 2 sc in next st; repeat from * around, sl st to first sc to join. (32 sts)
- Round 5: Ch 1, *1 sc in each of first 3 sts, 2 sc in next st; repeat from * around, sl st to first sc to join. (40 sts)
- Round 6: Ch 1, sc in each st around, sl st to first sc to join. (40 sts)
- Fasten off and weave in ends.

6. Finishing Instructions:
- Use yarn needle to weave in all ends securely
- Block lightly if desired to ensure flat, even shape
- For best results, wet block by soaking in water, gently squeezing out excess, and laying flat to dry

7. Variations & Tips:
- Change yarn color for different looks
- Use a larger hook for a more open, lacy texture
- Add a final round of reverse single crochet (crab stitch) for a decorative edge
- Make several and join them together for a larger project like a table runner
- For a stiffer coaster, consider using cotton yarn with a slightly smaller hook

8. Care Instructions:
- Hand wash in cool water with mild soap
- Lay flat to dry
- Do not bleach
- Steam or wet block as needed to reshape`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const crochetPrompt = "Analyze this crochet image and create a detailed pattern with the following information:\n1. Pattern Information (name, difficulty level, approximate size, time to complete)\n2. Materials Needed (yarn type/weight/color, hook size, notions, yardage)\n3. Abbreviations (standard crochet abbreviations used in the pattern)\n4. Gauge (if applicable)\n5. Pattern Instructions (detailed step-by-step instructions with stitch counts for each row/round)\n6. Finishing Instructions (weaving in ends, blocking, etc.)\n7. Variations & Tips (suggestions for customization, helpful tips)\n8. Care Instructions (washing, drying, storing)\n\nFormat the pattern in a clear, organized way that would be easy for a crocheter to follow. Be as specific and detailed as possible based on what you can see in the image.";
    try {
      const result = await analyzeImage(imageData, crochetPrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Crochet Pattern Generator</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload a crochet photo and get a detailed pattern to make it yourself</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Crochet Photo
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Crochet preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Scissors className="-ml-1 mr-2 h-5 w-5" />
                      Create Pattern
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Photo
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Crochet Pattern</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">AI Crochet Pattern Generator: Turn Photos into Patterns</h2>
          
          <p>Welcome to our free AI crochet pattern generator, powered by advanced artificial intelligence technology.
             This tool helps you transform photos of crochet projects into detailed, step-by-step patterns you can follow to create your own version.</p>

          <h3>How Our Pattern Generator Works</h3>
          <p>Our tool uses AI to analyze crochet photos and generate comprehensive patterns.
             Simply upload a clear photo of any crochet project, and our AI will create a detailed pattern with yarn recommendations, 
             stitch counts, and row-by-row instructions - perfect for crocheters of all skill levels.</p>

          <h3>Key Features of Our Crochet Pattern Generator</h3>
          <ul>
            <li>Instant pattern generation from photos</li>
            <li>Detailed materials lists with yarn weight and hook size recommendations</li>
            <li>Clear, step-by-step instructions</li>
            <li>Stitch counts for each row/round</li>
            <li>Customization suggestions and variations</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For:</h3>
          <ul>
            <li>Creating patterns from projects you admire</li>
            <li>Documenting your own crochet designs</li>
            <li>Learning new crochet techniques</li>
            <li>Adapting and modifying existing patterns</li>
            <li>Beginning crocheters looking for detailed instructions</li>
            <li>Experienced crafters seeking inspiration</li>
          </ul>

          <p>Try our free crochet pattern generator today and start bringing your crochet ideas to life!
             No registration required - just upload a photo and start creating.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}