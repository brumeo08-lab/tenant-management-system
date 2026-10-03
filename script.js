const tenants = [
  {
    id: 1,
    name: 'Northwind Labs',
    industry: 'Technology',
    plan: 'Enterprise',
    status: 'Active',
    storage: 210,
  },
  {
    id: 2,
    name: 'Aster Finance',
    industry: 'Finance',
    plan: 'Growth',
    status: 'Active',
    storage: 150,
  },
  {
    id: 3,
    name: 'Harbor Health',
    industry: 'Healthcare',
    plan: 'Starter',
    status: 'Pending',
    storage: 62,
  },
  {
    id: 4,
    name: 'Summit Retail',
    industry: 'Retail',
    plan: 'Growth',
    status: 'Suspended',
    storage: 98,
  },
];

const tenantTableBody = document.getElementById('tenantTableBody');
const totalTenants = document.getElementById('totalTenants');
const activePlans = document.getElementById('activePlans');
const storageUsed = document.getElementById('storageUsed');
const monthlyRevenue = document.getElementById('monthlyRevenue');
const tenantForm = document.getElementById('tenantForm');
const newTenantBtn = document.getElementById('newTenantBtn');
const cancelBtn = document.getElementById('cancelBtn');

const planRates = {
  Starter: 49,
  Growth: 129,
  Enterprise: 299,
};

function statusClass(status) {
  const normalized = status.toLowerCase();
  if (normalized === 'active') return 'status-active';
  if (normalized === 'pending') return 'status-pending';
  return 'status-suspended';
}

function renderStats() {
  const activeTenantCount = tenants.filter((tenant) => tenant.status === 'Active').length;
  const totalStorage = tenants.reduce((sum, tenant) => sum + tenant.storage, 0);
  const revenue = tenants.reduce((sum, tenant) => sum + planRates[tenant.plan], 0);

  totalTenants.textContent = tenants.length;
  activePlans.textContent = activeTenantCount;
  storageUsed.textContent = `${totalStorage} GB`;
  monthlyRevenue.textContent = `$${revenue}`;
}

function renderTable() {
  tenantTableBody.innerHTML = tenants
    .map(
      (tenant) => `
        <tr>
          <td>${tenant.name}</td>
          <td>${tenant.industry}</td>
          <td>${tenant.plan}</td>
          <td><span class="status-badge ${statusClass(tenant.status)}">${tenant.status}</span></td>
          <td>${tenant.storage} GB</td>
          <td>
            <button class="action-btn" data-action="edit" data-id="${tenant.id}">Edit</button>
            <button class="action-btn" data-action="delete" data-id="${tenant.id}">Delete</button>
          </td>
        </tr>
      `
    )
    .join('');

  renderStats();
}

function addTenant(event) {
  event.preventDefault();

  const name = document.getElementById('tenantName').value.trim();
  const industry = document.getElementById('tenantIndustry').value;
  const plan = document.getElementById('tenantPlan').value;
  const status = document.getElementById('tenantStatus').value;
  const storage = Number(document.getElementById('tenantStorage').value) || 0;

  if (!name) return;

  tenants.unshift({
    id: Date.now(),
    name,
    industry,
    plan,
    status,
    storage,
  });

  tenantForm.reset();
  document.getElementById('tenantStorage').value = 50;
  renderTable();
}

function handleTableActions(event) {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;

  const { action, id } = actionEl.dataset;
  const tenantIndex = tenants.findIndex((tenant) => tenant.id === Number(id));
  if (tenantIndex === -1) return;

  if (action === 'delete') {
    tenants.splice(tenantIndex, 1);
    renderTable();
  }

  if (action === 'edit') {
    const tenant = tenants[tenantIndex];
    document.getElementById('tenantName').value = tenant.name;
    document.getElementById('tenantIndustry').value = tenant.industry;
    document.getElementById('tenantPlan').value = tenant.plan;
    document.getElementById('tenantStatus').value = tenant.status;
    document.getElementById('tenantStorage').value = tenant.storage;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const submitBtn = tenantForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Tenant';

    tenantForm.dataset.editId = String(tenant.id);
  }
}

tenantForm.addEventListener('submit', (event) => {
  const editId = tenantForm.dataset.editId;

  if (editId) {
    event.preventDefault();
    const tenantIndex = tenants.findIndex((tenant) => tenant.id === Number(editId));
    if (tenantIndex !== -1) {
      tenants[tenantIndex] = {
        ...tenants[tenantIndex],
        name: document.getElementById('tenantName').value.trim(),
        industry: document.getElementById('tenantIndustry').value,
        plan: document.getElementById('tenantPlan').value,
        status: document.getElementById('tenantStatus').value,
        storage: Number(document.getElementById('tenantStorage').value),
      };
    }

    tenantForm.reset();
    document.getElementById('tenantStorage').value = 50;
    tenantForm.removeAttribute('data-edit-id');
    tenantForm.querySelector('button[type="submit"]').textContent = 'Save Tenant';
    renderTable();
    return;
  }

  addTenant(event);
});

newTenantBtn.addEventListener('click', () => {
  document.getElementById('tenantName').focus();
});

cancelBtn.addEventListener('click', () => {
  tenantForm.reset();
  document.getElementById('tenantStorage').value = 50;
  tenantForm.removeAttribute('data-edit-id');
  tenantForm.querySelector('button[type="submit"]').textContent = 'Save Tenant';
});

tenantTableBody.addEventListener('click', handleTableActions);

renderTable();
