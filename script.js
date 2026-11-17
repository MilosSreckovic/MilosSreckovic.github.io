const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const ciProjects = [
  {
    elementId: 'playwright-ci-status',
    repository: 'MilosSreckovic/QA-Automation-Exercise'
  },
  {
    elementId: 'selenium-ci-status',
    repository: 'MilosSreckovic/AutomationExerciseForSokin-CsharpSeleniumNunit'
  }
];

async function updateCIStatus(project) {
  const element = document.getElementById(project.elementId);
  if (!element) return;

  element.textContent = '● Checking CI...';
  element.classList.remove('status-success', 'status-pending');

  try {
    const response = await fetch(
      `https://api.github.com/repos/${project.repository}/actions/runs?status=completed&per_page=1`,
      {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();
    const latestRun = data.workflow_runs?.[0];

    if (!latestRun) {
      throw new Error('No completed workflow runs found');
    }

    if (latestRun.conclusion === 'success') {
      element.textContent = '● CI passing';
      element.classList.add('status-success');
    } else if (latestRun.conclusion === 'failure') {
      element.textContent = '● CI failing';
      element.classList.add('status-pending');
    } else {
      element.textContent = '● CI ' + latestRun.conclusion;
      element.classList.add('status-pending');
    }
  } catch (error) {
    console.warn(`CI status unavailable for ${project.repository}`, error);
    element.textContent = '● Status unavailable';
  }
}

ciProjects.forEach(updateCIStatus);
