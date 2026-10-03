import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServiceHero } from '../components/ServiceHero';
import { SERVICE_SOCIAL_IMAGES, getServiceSocialImage } from '../config/hero-theme';
import { getIndexableUrlEntries, getDynamicUrlEntries } from '../lib/sitemap-generator';
import { PRODUCTION_ACTIVE_DIFFERENTIATION_REGION_IDS } from '../engine/content-engine';

describe('STEP N-3D: Hero Image ALT & Naver Thumbnail Micro Fix Test Suite', () => {
  it('A. ServiceHero WASTE hero image renders non-empty ALT and does NOT contain aria-hidden on img', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(ServiceHero, {
        serviceFamily: 'WASTE',
        serviceLabel: '폐기물 수거 · 처리',
        h1Main: '서울 강서구 폐기물 수거',
        h1Sub: '빈집 정리 및 폐기물 처리',
        supportingCopy: '신속하고 깨끗하게 처리해 드립니다.',
        breadcrumbs: [{ label: '홈', href: '/' }, { label: '강서구 폐기물 수거' }],
      })
    );

    assert.ok(html.includes('alt="올케어환경 폐기물 수거 작업 현장 이미지"'));
    assert.ok(!html.includes('aria-hidden="true"') || html.includes('alt="올케어환경 폐기물 수거 작업 현장 이미지"'));
    // Specifically check that img tag does not have aria-hidden="true"
    const imgMatch = html.match(/<img[^>]+>/);
    assert.ok(imgMatch, 'img tag should exist');
    assert.ok(!imgMatch[0].includes('aria-hidden="true"'), 'hero img tag must not have aria-hidden="true"');
    assert.ok(imgMatch[0].includes('alt="올케어환경 폐기물 수거 작업 현장 이미지"'), 'hero img tag must have meaningful alt');
  });

  it('B. ServiceHero DEMOLITION hero image renders non-empty ALT and does NOT contain aria-hidden on img', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(ServiceHero, {
        serviceFamily: 'DEMOLITION',
        serviceLabel: '철거 · 원상복구',
        h1Main: '서울 강서구 철거',
        h1Sub: '인테리어 철거 및 원상복구',
        supportingCopy: '안전하고 정직하게 철거해 드립니다.',
        breadcrumbs: [{ label: '홈', href: '/' }, { label: '강서구 철거' }],
      })
    );

    const imgMatch = html.match(/<img[^>]+>/);
    assert.ok(imgMatch, 'img tag should exist');
    assert.ok(!imgMatch[0].includes('aria-hidden="true"'), 'hero img tag must not have aria-hidden="true"');
    assert.ok(imgMatch[0].includes('alt="올케어환경 철거 작업 현장 이미지"'), 'hero img tag must have meaningful alt');
  });

  it('C. Zero Keyword Stuffing in Hero ALT - hero ALT remains static neutral service description', () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(ServiceHero, {
        serviceFamily: 'WASTE',
        serviceLabel: '폐기물 수거 · 처리',
        h1Main: '특정동 특정키워드 폐기물 수거',
        h1Sub: '가구 버리기',
        supportingCopy: '안내문',
        breadcrumbs: [],
      })
    );

    assert.ok(!html.includes('alt="특정동'));
    assert.ok(html.includes('alt="올케어환경 폐기물 수거 작업 현장 이미지"'));
  });

  it('D. SERVICE_SOCIAL_IMAGES is configured for both WASTE and DEMOLITION with proper alt and path', () => {
    const wasteSocial = getServiceSocialImage('WASTE');
    assert.equal(wasteSocial.path, '/images/hero/waste-hero.jpg');
    assert.equal(wasteSocial.width, 1024);
    assert.equal(wasteSocial.height, 935);
    assert.ok(wasteSocial.alt.length > 0);

    const demoSocial = getServiceSocialImage('DEMOLITION');
    assert.equal(demoSocial.path, '/images/hero/demolition-hero.jpg');
    assert.equal(demoSocial.width, 1024);
    assert.equal(demoSocial.height, 768);
    assert.ok(demoSocial.alt.length > 0);
  });

  it('E. Production Active Differentiation Regions count remains exactly 311', () => {
    assert.equal(PRODUCTION_ACTIVE_DIFFERENTIATION_REGION_IDS.size, 311);
  });

  it('F. WASTE dynamic URLs count remains exactly 4,665', () => {
    const dynamicEntries = getDynamicUrlEntries();
    const wasteEntries = dynamicEntries.filter((e) => e.serviceFamily === 'WASTE');
    assert.equal(wasteEntries.length, 4665);
  });

  it('G. Total Indexable Sitemap URLs count remains exactly 4,669 (Core: 4 + Dynamic: 4,665)', () => {
    const indexableEntries = getIndexableUrlEntries();
    assert.equal(indexableEntries.length, 4669);
  });

  it('H. DEMOLITION indexable sitemap URLs count remains exactly 0', () => {
    const indexableEntries = getIndexableUrlEntries();
    const demoEntries = indexableEntries.filter((e) => e.serviceFamily === 'DEMOLITION');
    assert.equal(demoEntries.length, 0);
  });
});
