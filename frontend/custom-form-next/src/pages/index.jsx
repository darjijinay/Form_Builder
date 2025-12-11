import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center ">
              <div className="flex items-center justify-center">
                <Image src={logo} alt="FormCraft Logo" width={48} height={48} className="drop-shadow-sm" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FormCraft</span>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-[15px] font-medium text-slate-700 hover:text-indigo-600 transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#templates" className="text-[15px] font-medium text-slate-700 hover:text-indigo-600 transition-colors relative group">
                Templates
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#pricing" className="text-[15px] font-medium text-slate-700 hover:text-indigo-600 transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="px-5 py-2.5 text-[15px] font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="px-6 py-3 text-[15px] font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Build Powerful Forms
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Without Code
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              Build, customize, and share dynamic forms with our intuitive drag-and-drop builder. 
              Collect responses, analyze data, and streamline your workflow.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/register" className="px-8 py-4 text-lg font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
                Start Building Free
              </Link>
              <a href="#features" className="px-8 py-4 text-lg font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Build Forms</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Powerful features to create, share, and manage your forms efficiently</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 hover:border-indigo-200 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Drag & Drop Builder</h3>
              <p className="text-slate-600">Intuitive interface to create forms without any coding knowledge. Simply drag fields and customize.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 hover:border-emerald-200 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Themes</h3>
              <p className="text-slate-600">Personalize your forms with custom colors, fonts, and styling to match your brand perfectly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 hover:border-sky-200 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-colors">
                <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Response Analytics</h3>
              <p className="text-slate-600">Track submissions, analyze responses, and export data to CSV for deeper insights.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 hover:border-purple-200 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-slate-600">Your data is encrypted and secure. Control who can access your forms and responses.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 hover:border-pink-200 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Sharing</h3>
              <p className="text-slate-600">Share forms via link, embed on websites, or send directly to respondents with one click.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 hover:border-orange-200 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">10+ Field Types</h3>
              <p className="text-slate-600">Text, email, number, date, dropdown, radio, checkbox, file upload, rating, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
            <p className="text-sm font-medium text-purple-100 mb-3">Join thousands of users creating forms with FormCraft</p>
            <h2 className="text-4xl font-bold mb-8">Ready to Build Your First Form?</h2>
            <p className="text-lg text-purple-100 mb-10 leading-relaxed">
              Join thousands of users creating beautiful forms. Start with FormCraft today.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <Link href="/auth/register" className="px-8 py-3 text-lg font-medium rounded-lg bg-white text-purple-600 hover:bg-gray-100 transition-all">
                Get Started for Free
              </Link>
              <button className="px-8 py-3 text-lg font-medium rounded-lg border-2 border-white/50 text-white hover:border-white transition-all">
                Contact Sales
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-purple-100 flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center mb-4">
                <Image src={logo} alt="FormCraft Logo" width={36} height={36} className="drop-shadow-sm" />
                <span className="text-lg font-bold">FormCraft</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Building the future of data collection, one form at a time.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a></li>
                <li><a href="#templates" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Templates</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Integrations</a></li>
                <li><a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200/80"></div>

          {/* Footer Bottom */}
          <div className="pt-8 text-center">
            <p className="text-sm text-slate-600">© 2025 FormCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
