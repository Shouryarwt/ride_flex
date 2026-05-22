import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Identifier, 2: Link Sent, 3: New Password
  const [role, setRole] = useState('user'); // 'user' or 'seller'
  const { login, register, resetPassword, sendResetLink } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', name: '', mobile: '',
    identifier: '', otp: '',
    // Seller Specific
    gstNumber: '', shopName: '', address: '',
    bankName: '', accountNo: '', ifsc: '',
    // User Specific
    dlNumber: '', profilePic: '',
    // Documents
    idProof: '', gstProof: ''
  });

  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setPasswordStrength(calculateStrength(e.target.value));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [e.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReset) {
      if (resetStep === 1) {
        // Step 1: Send Reset Link
        const res = await sendResetLink(formData.identifier, role);
        if (res.success) setResetStep(2);
        else alert(res.message);
      } else if (resetStep === 2) {
        // Step 2: Simulate Link Click
        setResetStep(3);
      } else if (resetStep === 3) {
        // Step 3: Reset Password
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        const res = await resetPassword(formData.identifier, formData.password, role);
        if (res.success) {
          alert("Password Reset Successful! Please Login.");
          setIsReset(false);
          setIsLogin(true);
          setResetStep(1);
          setFormData({ ...formData, password: '', confirmPassword: '', otp: '', identifier: '' });
        } else {
          alert(res.message);
        }
      }
    } else if (isLogin) {
      // Login with Identifier (Email or Mobile)
      const res = await login(formData.identifier, formData.password, role, rememberMe);
      if (res.success) {
        const actualRole = res.user?.role || role;
        if (actualRole === 'admin') navigate('/admin-dashboard');
        else if (actualRole === 'seller') navigate('/seller-dashboard');
        else navigate('/dashboard');
      } else {
        alert(res.message);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (role === 'user') {
        if (formData.dlNumber.length > 15) {
          alert("Driving License Number cannot exceed 15 characters.");
          return;
        }
        if (!/[a-zA-Z]/.test(formData.dlNumber)) {
          alert("Driving License Number must contain alphabets.");
          return;
        }
      }
      const res = await register(formData, role);
      if (res.success) {
        alert("Registration Successful!");
        const actualRole = res.user?.role || role;
        if (actualRole === 'admin') navigate('/admin-dashboard');
        else if (actualRole === 'seller') navigate('/seller-dashboard');
        else navigate('/dashboard');
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-lg transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-800 dark:text-white">
          {isReset ? (resetStep === 1 ? 'Reset Password' : resetStep === 2 ? 'Link Sent' : 'New Password') : (isLogin ? 'Welcome Back' : 'Join Ride Flex')}
        </h2>

        {/* Role Toggle */}
        <div className="flex bg-slate-200 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-md font-medium transition ${role === 'user' ? 'bg-white shadow text-slate-900' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setRole('user')}
          >
            Customer
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-medium transition ${role === 'seller' ? 'bg-white shadow text-slate-900' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setRole('seller')}
          >
            Dealer (Seller)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          {!isLogin && !isReset && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input required name="name" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                <input required name="mobile" type="tel" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
            </>
          )}
          
          {/* Login / Reset Identifier Field */}
          {(isLogin || (isReset && resetStep === 1)) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email or Mobile Number</label>
              <input required name="identifier" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
          )}

          {/* Registration Email Field */}
          {!isLogin && !isReset && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input required name="email" type="email" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
          )}

          {/* Remember Me Checkbox */}
          {isLogin && !isReset && (
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
          )}

          {/* Password Field (Login, Register, Reset Step 3) */}
          {(!isReset || (isReset && resetStep === 3)) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{isReset ? "New Password" : "Password"}</label>
              <div className="relative mt-1">
                <input required name="password" type={showPassword ? "text" : "password"} onChange={handleChange} className="w-full p-2 border rounded pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {((!isLogin && !isReset) || (isReset && resetStep === 3)) && formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                          i < passwordStrength 
                            ? (passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500') 
                            : 'bg-gray-200 dark:bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right font-medium">
                    {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password Field */}
          {((!isLogin && !isReset) || (isReset && resetStep === 3)) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input required name="confirmPassword" type={showPassword ? "text" : "password"} onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
          )}

          {/* Link Sent Message (Reset Step 2) */}
          {isReset && resetStep === 2 && (
            <div className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
              <p className="text-green-700 dark:text-green-400 font-medium">Reset link sent!</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">Check your email inbox.</p>
            </div>
          )}

          {/* Seller Specific Registration Fields */}
          {!isLogin && !isReset && role === 'seller' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shop / Dealer Name</label>
                <input required name="shopName" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GST Number (Unique)</label>
                <input required name="gstNumber" type="text" placeholder="GSTIN..." onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                <p className="text-xs text-red-500 mt-1">* Critical: Cannot register duplicate GST</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Address</label>
                <textarea required name="address" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              
              {/* Bank Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                  <input required name="bankName" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IFSC Code</label>
                  <input required name="ifsc" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                <input required name="accountNo" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              {/* Document Uploads */}
              <div className="border-t pt-4 mt-2">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Essential Documentation</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Government ID Proof</label>
                    <input required name="idProof" onChange={handleFileChange} type="file" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GST Certificate / Shop License</label>
                    <input required name="gstProof" onChange={handleFileChange} type="file" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"/>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* User Specific Registration Fields */}
          {!isLogin && !isReset && role === 'user' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                <input name="profilePic" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 mt-1"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Driving License Number</label>
                <input required name="dlNumber" type="text" onChange={handleChange} className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                <p className="text-xs text-gray-500 mt-1">Verification required before booking.</p>
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">
            {isReset 
              ? (resetStep === 1 ? 'Send Reset Link' : resetStep === 2 ? 'Simulate Link Click' : 'Set New Password') 
              : (isLogin ? 'Login' : 'Register')
            }
          </button>
        </form>

        <div className="mt-4 text-center">
          {!isReset ? (
            <>
              <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline text-sm block w-full mb-2">
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
              {isLogin && (
                <button onClick={() => { setIsReset(true); setResetStep(1); }} className="text-gray-500 hover:underline text-xs">
                  Forgot Password?
                </button>
              )}
            </>
          ) : (
            <button onClick={() => { setIsReset(false); setResetStep(1); }} className="text-blue-600 hover:underline text-sm">
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;