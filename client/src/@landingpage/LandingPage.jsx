import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Target,
    Lock,
    Zap,
    CalculatorIcon,
    ArrowRight,
    Star,
    CheckCircle
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const handleGetStarted = () => {
        window.location.href = '/auth';
    };

    return (
        <div className="landing-page">
            {/* ============================================ */}
            {/* HERO SECTION */}
            {/* ============================================ */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Master Your Finances with <span className="gradient-text">Countdown</span>
                        </h1>
                        <p className="hero-subtitle">
                            Take control of your income, expenses, and loans in one beautiful dashboard. Plan smarter, spend wisely, and achieve financial freedom.
                        </p>
                        <div className="hero-cta">
                            <button className="btn-primary btn-lg" onClick={handleGetStarted}>
                                Get Started Free <ArrowRight size={20} />
                            </button>
                            <button className="btn-secondary btn-lg">
                                Watch Demo
                            </button>
                        </div>
                        <p className="hero-subtext">✓ No credit card required • ✓ Free forever • ✓ Privacy first</p>
                    </div>
                    <div className="hero-visual">
                        <div className="dashboard-preview">
                            <div className="preview-bar"></div>
                            <div className="preview-content">
                                <div className="preview-card"></div>
                                <div className="preview-card"></div>
                                <div className="preview-card"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* FEATURES SECTION */}
            {/* ============================================ */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Powerful Features</h2>
                        <p>Everything you need to manage your finances</p>
                    </div>

          <div className="features-grid">
            {/* Income Tracking */}
            <div className="feature-card glass-card">
              <div className="feature-icon income-icon">
                <BarChart3 size={28} />
              </div>
              <h3>Income Tracking</h3>
              <p>Monitor all your income sources in one place. Track salaries, freelance earnings, investments, and more.</p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Multiple income sources</li>
                <li><CheckCircle size={16} /> Historical tracking</li>
                <li><CheckCircle size={16} /> Income analytics</li>
              </ul>
            </div>

            {/* Expense Management */}
            <div className="feature-card glass-card">
              <div className="feature-icon expense-icon">
                <Target size={28} />
              </div>
              <h3>Expense Management</h3>
              <p>Categorize and track every expense. Understand your spending patterns and set budgets.</p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Smart categories</li>
                <li><CheckCircle size={16} /> Budget alerts</li>
                <li><CheckCircle size={16} /> Spending insights</li>
              </ul>
            </div>

            {/* Loan Management */}
            <div className="feature-card glass-card">
              <div className="feature-icon loan-icon">
                <CalculatorIcon size={28} />
              </div>
              <h3>Loan Management</h3>
              <p>Track loans and EMI payments. Visualize your debt payoff timeline with precision.</p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> EMI calculations</li>
                <li><CheckCircle size={16} /> Payoff timeline</li>
                <li><CheckCircle size={16} /> Interest tracking</li>
              </ul>
            </div>

            {/* Smart Simulation */}
            <div className="feature-card glass-card">
              <div className="feature-icon simulator-icon">
                <Zap size={28} />
              </div>
              <h3>Smart Simulation</h3>
              <p>Run "what-if" scenarios. See how extra payments can accelerate your payoff timeline.</p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Scenario planning</li>
                <li><CheckCircle size={16} /> Savings projection</li>
                <li><CheckCircle size={16} /> Strategy testing</li>
              </ul>
            </div>

            {/* Multi-Currency */}
            <div className="feature-card glass-card">
              <div className="feature-icon currency-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Multi-Currency Support</h3>
              <p>Manage finances in USD, INR, EUR, GBP and more. Real-time currency updates.</p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> 150+ currencies</li>
                <li><CheckCircle size={16} /> Live rates</li>
                <li><CheckCircle size={16} /> Easy switching</li>
              </ul>
            </div>

            {/* Security */}
            <div className="feature-card glass-card">
              <div className="feature-icon security-icon">
                <Lock size={28} />
              </div>
              <h3>Bank-Level Security</h3>
              <p>Your data is encrypted and secure. We never store passwords or sensitive information.</p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> End-to-end encryption</li>
                <li><CheckCircle size={16} /> GDPR compliant</li>
                <li><CheckCircle size={16} /> Zero-knowledge proof</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENEFITS SECTION */}
      {/* ============================================ */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Countdown?</h2>
            <p>Built for people who take their finances seriously</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-number">1M+</div>
              <p>Transactions Tracked</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">98%</div>
              <p>User Satisfaction</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">50K+</div>
              <p>Active Users</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">24/7</div>
              <p>Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Users</h2>
            <p>See what our community has to say</p>
          </div>

          <div className="testimonials-grid">
            {/* Testimonial 1 */}
            <div className="testimonial-card glass-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "Countdown completely changed how I manage my finances. I finally understand where my money goes!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AM</div>
                <div>
                  <p className="author-name">Alex Martinez</p>
                  <p className="author-role">Freelancer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card glass-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "The loan simulator is amazing! I saved 2 years off my mortgage by planning strategically."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SJ</div>
                <div>
                  <p className="author-name">Sarah Johnson</p>
                  <p className="author-role">Homeowner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card glass-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "Finally, a finance app that respects my privacy and doesn't try to sell me stuff. Great experience!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">RP</div>
                <div>
                  <p className="author-name">Raj Patel</p>
                  <p className="author-role">Entrepreneur</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="testimonial-card glass-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">
                "The multi-currency support is perfect for my international lifestyle. So easy to use!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">EC</div>
                <div>
                  <p className="author-name">Emma Chen</p>
                  <p className="author-role">Digital Nomad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING SECTION */}
      {/* ============================================ */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that fits your needs</p>
          </div>

          <div className="pricing-grid">
            {/* Free Plan */}
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Free</h3>
                <p className="pricing-price"><span className="currency">$</span><span className="amount">0</span><span className="period">/mo</span></p>
              </div>
              <p className="pricing-description">Perfect for getting started</p>
              <ul className="pricing-features">
                <li><CheckCircle size={18} /> Unlimited transactions</li>
                <li><CheckCircle size={18} /> Basic analytics</li>
                <li><CheckCircle size={18} /> Mobile & web access</li>
                <li><CheckCircle size={18} /> 5 loan profiles</li>
                <li className="disabled"><CheckCircle size={18} className="disabled" /> Advanced reports</li>
                <li className="disabled"><CheckCircle size={18} className="disabled" /> Priority support</li>
              </ul>
              <button className="btn-secondary btn-block" onClick={handleGetStarted}>Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card pricing-card-featured glass-card">
              <div className="featured-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro</h3>
                <p className="pricing-price"><span className="currency">$</span><span className="amount">4.99</span><span className="period">/mo</span></p>
              </div>
              <p className="pricing-description">For serious planners</p>
              <ul className="pricing-features">
                <li><CheckCircle size={18} /> Everything in Free</li>
                <li><CheckCircle size={18} /> Unlimited loan profiles</li>
                <li><CheckCircle size={18} /> Advanced reports</li>
                <li><CheckCircle size={18} /> PDF export</li>
                <li><CheckCircle size={18} /> Custom alerts</li>
                <li className="disabled"><CheckCircle size={18} className="disabled" /> Priority support</li>
              </ul>
              <button className="btn-primary btn-block" onClick={handleGetStarted}>Start Free Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <p className="pricing-price"><span className="currency">Custom</span></p>
              </div>
              <p className="pricing-description">For teams & organizations</p>
              <ul className="pricing-features">
                <li><CheckCircle size={18} /> Everything in Pro</li>
                <li><CheckCircle size={18} /> Multiple users</li>
                <li><CheckCircle size={18} /> API access</li>
                <li><CheckCircle size={18} /> Custom integrations</li>
                <li><CheckCircle size={18} /> Priority support</li>
                <li><CheckCircle size={18} /> Dedicated account manager</li>
              </ul>
              <button className="btn-secondary btn-block">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Take Control?</h2>
            <p>Join thousands of people who are already managing their finances smarter</p>
            <button className="btn-primary btn-lg" onClick={handleGetStarted}>
              Start Your Free Account <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Countdown</h4>
              <p>Master your finances, one transaction at a time.</p>
            </div>
            <div className="footer-section">
              <h5>Product</h5>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#security">Security</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Company</h5>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Legal</h5>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Countdown Finance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
