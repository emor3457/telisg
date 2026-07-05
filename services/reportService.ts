import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

import { ObservationItem } from '../store/observationStore';
import { useSettingsStore } from '../store/settingsStore';
import { colors } from '../theme/colors';



// --- Shared CSS ---
function getBaseStyles(riskColor?: string) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    @page { margin: 18mm 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #111827;
      background: white;
      font-size: 13px;
      line-height: 1.6;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 14px;
      border-bottom: 4px solid #0F766E;
      margin-bottom: 28px;
    }
    .company-brand { display: flex; align-items: center; gap: 12px; }
    .logo-img { height: 48px; object-fit: contain; }
    .brand-text .company-name { font-size: 18px; font-weight: 800; color: #111827; }
    .brand-text .company-subtitle { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; }
    .report-meta { text-align: right; }
    .report-meta .report-type { font-size: 11px; font-weight: 700; color: #0F766E; text-transform: uppercase; letter-spacing: 1.5px; }
    .report-meta .report-date { font-size: 11px; color: #6B7280; margin-top: 2px; }
    .report-meta .report-id { font-size: 16px; font-weight: 800; color: #111827; margin-top: 4px; }

    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 11px; font-weight: 800; color: #6B7280;
      text-transform: uppercase; letter-spacing: 1.5px;
      border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; margin-bottom: 12px;
    }
    .content-text { font-size: 13px; color: #374151; }

    .risk-badge {
      display: inline-block; padding: 5px 16px; border-radius: 20px;
      color: white; font-weight: 700; font-size: 12px;
      background-color: ${riskColor || '#6B7280'};
      text-transform: uppercase; letter-spacing: 1px;
    }
    .controls-list { padding-left: 18px; }
    .controls-list li { margin-bottom: 6px; color: #374151; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-card { background: #F9FAFB; border-radius: 8px; padding: 12px 16px; border-left: 4px solid #0F766E; }
    .info-card .label { font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; }
    .info-card .value { font-size: 15px; font-weight: 800; color: #111827; margin-top: 2px; }

    .image-box { border-radius: 10px; overflow: hidden; border: 1px solid #E5E7EB; margin-bottom: 24px; background: #F9FAFB; }
    .image-box img { width: 100%; max-height: 420px; object-fit: cover; display: block; }
    .image-placeholder { padding: 36px; text-align: center; color: #9CA3AF; font-size: 13px; }

    .signature-section { display: flex; justify-content: space-between; gap: 40px; margin-top: 50px; }
    .signature-box { flex: 1; text-align: center; }
    .sig-label { font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 40px; }
    .sig-line { border-top: 1px solid #111827; padding-top: 8px; }
    .sig-name { font-size: 13px; font-weight: 700; color: #111827; }
    .sig-title { font-size: 11px; color: #6B7280; margin-top: 2px; }

    .footer {
      margin-top: 48px; padding-top: 14px; border-top: 1px solid #E5E7EB;
      font-size: 10px; color: #9CA3AF; text-align: center;
    }
    .footer strong { color: #0F766E; }

    /* Summary report extras */
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #0F766E; color: white; padding: 8px 10px; text-align: left; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; }
    td { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; color: #374151; vertical-align: top; }
    tr:nth-child(even) td { background: #F9FAFB; }
    .status-pill {
      display: inline-block; padding: 2px 10px; border-radius: 12px;
      font-size: 10px; font-weight: 700; color: white;
    }
    .status-bekliyor { background: #F59E0B; }
    .status-devam { background: #0EA5E9; }
    .status-tamamlandi { background: #16A34A; }
    .risk-pill {
      display: inline-block; padding: 2px 10px; border-radius: 12px;
      font-size: 10px; font-weight: 700; color: white;
    }
    .risk-critical { background: #991B1B; }
    .risk-high { background: #DC2626; }
    .risk-medium { background: #F59E0B; }
    .risk-low { background: #16A34A; }
    .kpi-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .kpi-card { flex: 1; background: #F9FAFB; border-radius: 8px; padding: 14px; text-align: center; border-top: 4px solid #0F766E; }
    .kpi-card.orange { border-top-color: #F97316; }
    .kpi-card.blue { border-top-color: #0EA5E9; }
    .kpi-card.green { border-top-color: #16A34A; }
    .kpi-card.red { border-top-color: #DC2626; }
    .kpi-num { font-size: 28px; font-weight: 800; color: #111827; }
    .kpi-label { font-size: 10px; color: #6B7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }
  `;
}

function renderHeader(companyName: string, companyLogo: string | null, reportType: string, reportId: string) {
  const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  return `
    <div class="page-header">
      <div class="company-brand">
        ${companyLogo
          ? `<img src="${companyLogo}" class="logo-img" />`
          : ``
        }
        <div class="brand-text">
          <div class="company-name">${companyName || 'ŞİRKET ADI'}</div>
          <div class="company-subtitle">İSG Yönetim Sistemi</div>
        </div>
      </div>
      <div class="report-meta">
        <div class="report-type">${reportType}</div>
        <div class="report-date">${today}</div>
        <div class="report-id">${reportId}</div>
      </div>
    </div>
  `;
}

function renderSignatures(userName: string, userTitle: string, expertName: string) {
  return `
    <div class="signature-section">
      <div class="signature-box">
        <div class="sig-label">Hazırlayan</div>
        <div class="sig-line">
          <div class="sig-name">${userName || '____________________'}</div>
          <div class="sig-title">${userTitle || ''}</div>
        </div>
      </div>
      <div class="signature-box">
        <div class="sig-label">Onaylayan</div>
        <div class="sig-line">
          <div class="sig-name">${expertName || '____________________'}</div>
          <div class="sig-title">İSG Uzmanı</div>
        </div>
      </div>
    </div>
  `;
}

function renderFooter(companyName: string) {
  return `
    <div class="footer">
      Bu rapor ISO 45001:2018 standartlarına uygun olarak <strong>${companyName || 'Şirket'}</strong> adına
      <strong>TELISGPRO EHS Management System</strong> üzerinden oluşturulmuştur.
    </div>
  `;
}

// ══════════════════════════════════════════════
// 1) TEK GÖZLEM RAPORU
// ══════════════════════════════════════════════
export async function generateObservationPDF(observation: ObservationItem) {
  const { companyName, companyLogo, userName, userTitle, expertName } = useSettingsStore.getState();

  const riskColor =
    observation.riskLevel === 'CRITICAL' ? '#991B1B'
    : observation.riskLevel === 'HIGH' ? '#DC2626'
    : observation.riskLevel === 'MEDIUM' ? '#F59E0B' : '#16A34A';

  const riskLabel =
    observation.riskLevel === 'CRITICAL' ? 'KRİTİK'
    : observation.riskLevel === 'HIGH' ? 'YÜKSEK'
    : observation.riskLevel === 'MEDIUM' ? 'ORTA' : 'DÜŞÜK';

  // Resim dizisinden ilkini al ve base64'e çevir (PDF için)
  let imageBase64 = null;
  if (observation.photos && observation.photos.length > 0) {
    try {
      const firstPhotoUri = observation.photos[0].uri;
      const base64Content = await FileSystem.readAsStringAsync(firstPhotoUri, {
        encoding: 'base64',
      });
      imageBase64 = `data:image/jpeg;base64,${base64Content}`;
    } catch (error) {
      console.warn('PDF için resim dönüştürme hatası:', error);
    }
  }

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${getBaseStyles(riskColor)}</style>
      </head>
      <body>
        ${renderHeader(companyName, companyLogo, 'Saha Gözlem Raporu', observation.displayId || 'ISG-GÖZLEM')}

        <div class="info-grid">
          <div class="info-card">
            <div class="label">Tespit Tarihi</div>
            <div class="value">${new Date(observation.date).toLocaleDateString('tr-TR')}</div>
          </div>
          <div class="info-card">
            <div class="label">Risk Seviyesi</div>
            <div class="value"><span class="risk-badge">${riskLabel}</span></div>
          </div>
        </div>

        <div class="image-box">
          ${imageBase64
            ? `<img src="${imageBase64}" alt="Saha Gözlem Fotoğrafı" />`
            : `<div class="image-placeholder">📷 Fotoğraf Eklenmedi</div>`
          }
        </div>

        <div class="section">
          <div class="section-title">Tespit Edilen Tehlike / Durum</div>
          <div class="content-text">${observation.hazard}</div>
        </div>

        <div class="section">
          <div class="section-title">Düzeltici ve Önleyici Faaliyet Önerileri (DÖF)</div>
          <ul class="controls-list">
            ${observation.controls.map((c, i) => `<li><strong>${i + 1}.</strong> ${c}</li>`).join('')}
          </ul>
        </div>

        ${renderSignatures(userName, userTitle, expertName)}
        ${renderFooter(companyName)}
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw error;
  }
}

// ══════════════════════════════════════════════
// 2) GENEL DURUM RAPORU (Aksiyon Filtreleme)
// ══════════════════════════════════════════════
export interface ActionReportItem {
  id: string;
  displayId: string;
  parentDisplayId?: string;
  title: string;
  status: string;
  targetDate?: string;
  riskLevel?: string;
  department?: string;
  location?: string;
  equipment?: string;
}

export interface SummaryReportFilters {
  department?: string;
  location?: string;
  equipment?: string;
  status?: string;
}

export async function generateSummaryPDF(
  actions: ActionReportItem[],
  filters: SummaryReportFilters = {}
) {
  const { companyName, companyLogo, userName, userTitle, expertName } = useSettingsStore.getState();

  // Filtreleme
  let filtered = [...actions];
  if (filters.department) filtered = filtered.filter(a => a.department === filters.department);
  if (filters.location) filtered = filtered.filter(a => a.location === filters.location);
  if (filters.equipment) filtered = filtered.filter(a => a.equipment === filters.equipment);
  if (filters.status) filtered = filtered.filter(a => a.status === filters.status);

  // KPI Hesapları
  const total = filtered.length;
  const pending = filtered.filter(a => a.status === 'Bekliyor').length;
  const inProgress = filtered.filter(a => a.status === 'Devam Ediyor').length;
  const completed = filtered.filter(a => a.status === 'Tamamlandı').length;
  const closureRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filterDesc = [
    filters.department ? `Departman: <strong>${filters.department}</strong>` : '',
    filters.location ? `Lokasyon: <strong>${filters.location}</strong>` : '',
    filters.equipment ? `Ekipman: <strong>${filters.equipment}</strong>` : '',
    filters.status ? `Durum: <strong>${filters.status}</strong>` : '',
  ].filter(Boolean).join(' &nbsp;|&nbsp; ') || 'Tümü (Filtre Uygulanmadı)';

  const statusPill = (s: string) => {
    if (s === 'Bekliyor') return `<span class="status-pill status-bekliyor">Bekliyor</span>`;
    if (s === 'Devam Ediyor') return `<span class="status-pill status-devam">Devam Ediyor</span>`;
    return `<span class="status-pill status-tamamlandi">Tamamlandı</span>`;
  };

  const riskPill = (r?: string) => {
    if (!r) return '—';
    const cls = r === 'CRITICAL' ? 'risk-critical' : r === 'HIGH' ? 'risk-high' : r === 'MEDIUM' ? 'risk-medium' : 'risk-low';
    const label = r === 'CRITICAL' ? 'KRİTİK' : r === 'HIGH' ? 'YÜKSEK' : r === 'MEDIUM' ? 'ORTA' : 'DÜŞÜK';
    return `<span class="risk-pill ${cls}">${label}</span>`;
  };

  const tableRows = filtered.map(a => `
    <tr>
      <td><strong>${a.displayId}</strong><br/><span style="font-size:10px;color:#9CA3AF">${a.parentDisplayId || ''}</span></td>
      <td>${a.title}</td>
      <td>${riskPill(a.riskLevel)}</td>
      <td>${statusPill(a.status)}</td>
      <td>${a.targetDate ? new Date(a.targetDate).toLocaleDateString('tr-TR') : '—'}</td>
      <td>${a.department || '—'}</td>
      <td>${a.location || '—'}</td>
      <td>${a.equipment || '—'}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${getBaseStyles()}</style>
      </head>
      <body>
        ${renderHeader(companyName, companyLogo, 'DÖF Genel Durum Raporu', `RPT-${Date.now().toString().slice(-6)}`)}

        <div style="margin-bottom:20px; font-size:12px; color:#6B7280;">
          <strong>Filtreler:</strong> ${filterDesc}
        </div>

        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-num">${total}</div>
            <div class="kpi-label">Toplam Aksiyon</div>
          </div>
          <div class="kpi-card orange">
            <div class="kpi-num">${pending}</div>
            <div class="kpi-label">Bekliyor</div>
          </div>
          <div class="kpi-card blue">
            <div class="kpi-num">${inProgress}</div>
            <div class="kpi-label">Devam Ediyor</div>
          </div>
          <div class="kpi-card green">
            <div class="kpi-num">${completed}</div>
            <div class="kpi-label">Tamamlandı</div>
          </div>
          <div class="kpi-card ${closureRate >= 80 ? 'green' : closureRate >= 50 ? 'orange' : 'red'}">
            <div class="kpi-num">%${closureRate}</div>
            <div class="kpi-label">Kapama Oranı</div>
          </div>
        </div>

        ${filtered.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Aksiyon / DÖF</th>
              <th>Risk</th>
              <th>Durum</th>
              <th>Hedef Tarih</th>
              <th>Departman</th>
              <th>Lokasyon</th>
              <th>Ekipman</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        ` : `
        <div style="text-align:center; padding: 48px; color:#9CA3AF; font-size:14px;">
          Seçili filtrelere uygun aksiyon bulunamadı.
        </div>
        `}

        ${renderSignatures(userName, userTitle, expertName)}
        ${renderFooter(companyName)}
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Özet PDF oluşturma hatası:', error);
    throw error;
  }
}
