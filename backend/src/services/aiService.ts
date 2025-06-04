export interface TicketCategory {
  department: 'IT' | 'HR' | 'Admin';
  confidence: number;
  reason: string;
}

const IT_KEYWORDS = [
  // Hardware
  'computer', 'laptop', 'desktop', 'hardware', 'printer', 'scanner', 'device', 'monitor', 'keyboard', 'mouse',
  // Software
  'software', 'application', 'app', 'program', 'update', 'install', 'uninstall', 'patch', 'version',
  // Network
  'network', 'wifi', 'internet', 'connection', 'server', 'database', 'cloud', 'vpn', 'firewall',
  // Security
  'password', 'login', 'access', 'security', 'authentication', 'authorization', 'encryption',
  // Issues
  'error', 'bug', 'crash', 'slow', 'performance', 'issue', 'problem', 'trouble', 'not working',
  // Technical Terms
  'technical', 'system', 'configuration', 'settings', 'backup', 'restore', 'maintenance'
];

const HR_KEYWORDS = [
  // Employee Management
  'employee', 'staff', 'personnel', 'hiring', 'recruitment', 'interview', 'resume', 'candidate',
  // Benefits
  'benefit', 'insurance', 'health', 'dental', 'vision', 'coverage', 'claim',
  // Leave & Time Off
  'leave', 'vacation', 'sick', 'time off', 'absence', 'attendance',
  // Compensation
  'salary', 'compensation', 'pay', 'bonus', 'raise', 'promotion', 'increment',
  // Training & Development
  'training', 'development', 'course', 'learning', 'workshop', 'seminar',
  // Performance
  'performance', 'review', 'appraisal', 'evaluation', 'feedback',
  // Policies
  'policy', 'procedure', 'guideline', 'workplace', 'environment'
];

const ADMIN_KEYWORDS = [
  // Office Management
  'office', 'facility', 'maintenance', 'clean', 'supply', 'stationery', 'equipment',
  // Scheduling
  'schedule', 'meeting', 'room', 'booking', 'reservation', 'calendar',
  // Travel & Expenses
  'travel', 'expense', 'reimbursement', 'claim', 'receipt', 'invoice',
  // Documentation
  'document', 'form', 'approval', 'request', 'permission', 'authorization',
  // General
  'general', 'inquiry', 'information', 'assistance', 'help', 'support',
  // Compliance
  'compliance', 'regulation', 'policy', 'procedure', 'guideline'
];

export const categorizeTicket = (title: string, description: string): TicketCategory => {
  try {
    // Combine title and description, giving more weight to title
    const content = `${title} ${title} ${description}`.toLowerCase();
    
    // Count keyword matches for each department
    const itMatches = IT_KEYWORDS.filter(keyword => content.includes(keyword)).length;
    const hrMatches = HR_KEYWORDS.filter(keyword => content.includes(keyword)).length;
    const adminMatches = ADMIN_KEYWORDS.filter(keyword => content.includes(keyword)).length;
    
    // Calculate confidence scores with weighted title
    const totalMatches = itMatches + hrMatches + adminMatches;
    const itConfidence = totalMatches > 0 ? itMatches / totalMatches : 0;
    const hrConfidence = totalMatches > 0 ? hrMatches / totalMatches : 0;
    const adminConfidence = totalMatches > 0 ? adminMatches / totalMatches : 0;
    
    // Find the department with highest confidence
    const maxConfidence = Math.max(itConfidence, hrConfidence, adminConfidence);
    
    let department: 'IT' | 'HR' | 'Admin';
    let reason: string;
    
    if (maxConfidence === 0) {
      // If no keywords match, default to Admin
      department = 'Admin';
      reason = 'No specific department keywords found, defaulting to Admin';
    } else if (itConfidence === maxConfidence) {
      department = 'IT';
      reason = `Found ${itMatches} IT-related keywords (${(itConfidence * 100).toFixed(1)}% confidence)`;
    } else if (hrConfidence === maxConfidence) {
      department = 'HR';
      reason = `Found ${hrMatches} HR-related keywords (${(hrConfidence * 100).toFixed(1)}% confidence)`;
    } else {
      department = 'Admin';
      reason = `Found ${adminMatches} Admin-related keywords (${(adminConfidence * 100).toFixed(1)}% confidence)`;
    }
    
    return {
      department,
      confidence: maxConfidence,
      reason
    };
  } catch (error) {
    console.error('Error categorizing ticket:', error);
    return {
      department: 'Admin',
      confidence: 0.5,
      reason: 'Error in categorization, defaulting to Admin'
    };
  }
}; 