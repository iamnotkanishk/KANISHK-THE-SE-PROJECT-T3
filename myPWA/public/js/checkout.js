// Global state for PDF generation
let currentEvent = null;
let currentBooking = null;

function getLastBooking() { // Safely parse last booking from sessionStorage
  try {
    return JSON.parse(sessionStorage.getItem('lastBooking')) || null; 
  } catch { return null; } 
}

function getQueryParam(name) { // Utility to get query parameters from URL
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadFullEvent(eventId) { // Fetch full event details from server
  if (!eventId) return null;
  try {
    const resp = await fetch(`/events/${encodeURIComponent(eventId)}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.event || null;
  } catch { return null; }
}

function generatePDF() { // Generate PDF ticket using jsPDF
  if (!currentEvent || !currentBooking) {
    alert('Event or booking information not available.');
    return;
  }

  const jsPDFConstructor = window.jsPDF || window.jspdf?.jsPDF || window.jspdf;
  if (!jsPDFConstructor) {
    alert('PDF library not loaded. Please reload the page.');
    return;
  }

  const doc = new jsPDFConstructor(); // Create new PDF document
  
  // Title
  doc.setFontSize(24);
  doc.text('Event Ticket', 20, 20);
  
  // Event Details
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Event Information', 20, 35);
  
  doc.setFont(undefined, 'normal');
  let y = 45;
  doc.text(`Event: ${currentEvent.title || 'N/A'}`, 20, y);
  y += 7;
  doc.text(`Date: ${currentEvent.date || 'N/A'}`, 20, y);
  y += 7;
  doc.text(`Time: ${currentEvent.time || 'N/A'}`, 20, y);
  y += 7;
  doc.text(`Location: ${currentEvent.location || 'N/A'}`, 20, y);
  
  // Seats
  y += 15;
  doc.setFont(undefined, 'bold');
  doc.text('Your Seats', 20, y);
  y += 8;
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  (currentBooking.seats || []).forEach((seat, index) => {
    doc.text(`${index + 1}. ${seat}`, 20, y);
    y += 6;
  });
  
  // Footer
  y += 10;
  doc.setFontSize(10);
  doc.text('Thank you for booking with StagePass!', 20, y);
  y += 5;
  doc.text(`Booking ID: ${currentBooking.eventId}`, 20, y);
  
  // Download
  const fileName = `${(currentEvent.title || 'ticket').replace(/[^a-zA-Z0-9_-]/g, '_')}-${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

document.addEventListener('DOMContentLoaded', async () => { // Main initialization on page load
  const booking = getLastBooking();
  const eventInfoEl = document.getElementById('eventInfo');
  const seatsEl = document.getElementById('bookedSeats');
  const downloadBtn = document.getElementById('downloadPdfBtn');

  if (!booking) {
    eventInfoEl.textContent = 'No recent booking found.';
    return;
  }

  currentBooking = booking;
  
  // Load full event details
  const event = await loadFullEvent(booking.eventId);
  if (event) {
    currentEvent = event;
    eventInfoEl.textContent = `Event: ${event.title || 'Untitled'} • ${event.date || 'N/A'} • ${event.location || 'N/A'}`;
  } else {
    eventInfoEl.textContent = `Event ID: ${booking.eventId}`;
  }

  seatsEl.innerHTML = '';
  (booking.seats || []).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    seatsEl.appendChild(li);
  });

  // Attach download handler
  if (downloadBtn) {
    downloadBtn.type = 'button';
    downloadBtn.addEventListener('click', generatePDF);
  }

  // Clear lastBooking so refresh doesn't duplicate
  sessionStorage.removeItem('lastBooking');
});
