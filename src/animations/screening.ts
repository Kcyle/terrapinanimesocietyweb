export function initScreeningAnimations(): void {
  const heroSection = document.querySelector('[data-hero]');
  if (heroSection) return;

  const meetingsBg = document.querySelector('[data-meetings-bg]') as HTMLElement;
  const meetingsContent = document.querySelector('[data-meetings-content]') as HTMLElement;

  if (meetingsBg) meetingsBg.style.visibility = 'visible';

  if (meetingsContent) {
    meetingsContent.style.visibility = 'visible';
    meetingsContent.style.opacity = '1';
  }
}
