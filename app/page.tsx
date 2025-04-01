import DocumentDropezone from "@/components/DocumentDropezone";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart,
  ChartNoAxesCombined,
  Check,
  FileText,
  Search,
  Upload,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-blue-200 to-purple-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center ">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Intelligent Project anylzing
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                RoutePrime is a platform that helps you scan, analyze your
                projects with AI-driven tools and get insights into your data.
              </p>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link href="/projects">
                <Button className="bg-blue-500 hover:bg-blue-700 cursor-pointer">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* PDF Dropzone */}
        <div className="mt-12 flex justify-center ">
          <div className="relative w-full max-w-3xl p-4 bg-white rounded-lg shadow-lg border border-purple-200 overflow-hidden dark:border-gray-800 dark:bg-gray-950">
            <div className="p-6 md:p-8 relative">
              <DocumentDropezone />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 ">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                {" "}
                V16 Unlocked Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                Primerute, the AI-Driven Project Analysis Platform transforms
                how do you approach your business analytics and management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-purple-200 overflow-hidden dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Upload and Scan PDFs
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload your PDF files and let AI analyze them.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-green-200 overflow-hidden dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Search and Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Search and analyze your data with AI.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-blue-200 overflow-hidden dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <BarChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Data Insights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Let&apos;s the data tells the story.
                </p>
              </div>
              {/* Feature 4 */}
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-orange-200 overflow-hidden dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Business reports</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get your analysis business reports based on your project data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tigter md:text-4xl">
                Simple Pricing
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Choose the plan that suits your needs and works best for
                business
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="flex flex-col p-6 bg-white brder border-gray-200 rounded-lg shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold ">Free</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Free tier with limited features
                </p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-semibold">€0.00</p>
                <p className="text-gray-500 dark:text-gray-400">/month</p>
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Basic Document analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>02 Analysis per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Basic Data Extraction</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>14 days history</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="manage-plan">
                  <Button className="w-full" variant="outline">
                    Subscribe to plan
                  </Button>
                </Link>
              </div>
            </div>
            {/* Starter Tier */}
            <div className="flex flex-col p-6 bg-white brder border-gray-200 rounded-lg shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold ">Starter</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Starter tier with limited features
                </p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-semibold">€4.99</p>
                <p className="text-gray-500 dark:text-gray-400">/month</p>
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced Document analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>50 Analysis per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced Data Extraction</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>03 months history</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="manage-plan">
                  <Button className="w-full" variant="outline">
                    Subscribe to plan
                  </Button>
                </Link>
              </div>
            </div>
            {/* Pro Tier */}
            <div className="flex flex-col p-6 bg-blue-50 brder border-blue-200 rounded-lg shadow-sm dark:border-blue-900 dark:bg-blue-950 relative">
              <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold ">Pro</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Pro tier with all unlocked features
                </p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-semibold">€9.99</p>
                <p className="text-gray-500 dark:text-gray-400">/month</p>
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>umlimited Document analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>500 Analysis per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>unlimited Data Extraction</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Life history</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/manage-plan">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    variant="outline"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md-py-24">
        <div className="container py-4 md-px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto spaace-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Start Realizing your ideas today
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Get started with RoutePrime today and start analyzing your
                projects with AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-200">
        <div className="container px-4 md-px py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1">
              <ChartNoAxesCombined className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-semibold">RoutePrime</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} RoutePrime. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
