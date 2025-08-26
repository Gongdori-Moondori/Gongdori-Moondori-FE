'use client';

import React from 'react';

interface ColorSwatch {
  name: string;
  variable: string;
  description?: string;
}

const ColorPalette: React.FC = () => {
  const primaryColors: ColorSwatch[] = [
    {
      name: 'Primary 50',
      variable: '--primary-50',
      description: '가장 밝은 민트색',
    },
    { name: 'Primary 100', variable: '--primary-100' },
    { name: 'Primary 200', variable: '--primary-200' },
    { name: 'Primary 300', variable: '--primary-300' },
    { name: 'Primary 400', variable: '--primary-400' },
    {
      name: 'Primary 500',
      variable: '--primary-500',
      description: '메인 브랜드 색상',
    },
    { name: 'Primary 600', variable: '--primary-600' },
    { name: 'Primary 700', variable: '--primary-700' },
    { name: 'Primary 800', variable: '--primary-800' },
    { name: 'Primary 900', variable: '--primary-900' },
    {
      name: 'Primary 950',
      variable: '--primary-950',
      description: '가장 어두운 민트색',
    },
  ];

  const secondaryColors: ColorSwatch[] = [
    { name: 'Secondary 50', variable: '--secondary-50' },
    { name: 'Secondary 100', variable: '--secondary-100' },
    { name: 'Secondary 200', variable: '--secondary-200' },
    { name: 'Secondary 300', variable: '--secondary-300' },
    { name: 'Secondary 400', variable: '--secondary-400' },
    {
      name: 'Secondary 500',
      variable: '--secondary-500',
      description: '메인 회색',
    },
    { name: 'Secondary 600', variable: '--secondary-600' },
    { name: 'Secondary 700', variable: '--secondary-700' },
    { name: 'Secondary 800', variable: '--secondary-800' },
    { name: 'Secondary 900', variable: '--secondary-900' },
  ];

  const neutralColors: ColorSwatch[] = [
    { name: 'Neutral 50', variable: '--neutral-50' },
    { name: 'Neutral 100', variable: '--neutral-100' },
    { name: 'Neutral 200', variable: '--neutral-200' },
    { name: 'Neutral 300', variable: '--neutral-300' },
    { name: 'Neutral 400', variable: '--neutral-400' },
    {
      name: 'Neutral 500',
      variable: '--neutral-500',
      description: '중성 회색',
    },
    { name: 'Neutral 600', variable: '--neutral-600' },
    { name: 'Neutral 700', variable: '--neutral-700' },
    { name: 'Neutral 800', variable: '--neutral-800' },
    { name: 'Neutral 900', variable: '--neutral-900' },
  ];

  const accentColors: ColorSwatch[] = [
    {
      name: 'Yellow 500',
      variable: '--yellow-500',
      description: '노란색 액센트',
    },
    {
      name: 'Green 500',
      variable: '--green-500',
      description: '성공/신선함 (이제 Primary-500 사용 권장)',
    },
    { name: 'Red 500', variable: '--red-500', description: '에러/경고' },
  ];

  const semanticColors: ColorSwatch[] = [
    { name: 'Success', variable: '--success', description: '성공 상태' },
    { name: 'Warning', variable: '--warning', description: '주의 상태' },
    { name: 'Error', variable: '--error', description: '에러 상태' },
    { name: 'Info', variable: '--info', description: '정보 상태' },
  ];

  const ColorSwatchComponent: React.FC<{ color: ColorSwatch }> = ({
    color,
  }) => (
    <div className="flex flex-col items-center p-3 rounded-lg border border-neutral-200">
      <div
        className="w-16 h-16 rounded-lg border border-neutral-300 mb-2"
        style={{ backgroundColor: `var(${color.variable})` }}
      />
      <div className="text-xs font-medium text-neutral-700 text-center">
        {color.name}
      </div>
      {color.description && (
        <div className="text-xs text-neutral-500 text-center mt-1">
          {color.description}
        </div>
      )}
      <div className="text-xs text-neutral-400 text-center mt-1 font-mono">
        {color.variable}
      </div>
    </div>
  );

  const ColorSection: React.FC<{ title: string; colors: ColorSwatch[] }> = ({
    title,
    colors,
  }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {colors.map((color) => (
          <ColorSwatchComponent key={color.variable} color={color} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Rzi 컬러 팔레트
        </h1>
        <p className="text-neutral-600">
          Figma 스타일의 체계적인 컬러 시스템입니다. 각 컬러는 CSS 변수와
          유틸리티 클래스로 사용할 수 있습니다.
        </p>
      </div>

      <ColorSection
        title="Primary Colors (메인 브랜드)"
        colors={primaryColors}
      />
      <ColorSection
        title="Secondary Colors (보조 회색)"
        colors={secondaryColors}
      />
      <ColorSection title="Neutral Colors (중성 회색)" colors={neutralColors} />
      <ColorSection title="Accent Colors (액센트)" colors={accentColors} />
      <ColorSection
        title="Semantic Colors (의미적 색상)"
        colors={semanticColors}
      />

      <div className="mt-12 p-6 bg-neutral-50 rounded-lg">
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">사용법</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-neutral-700 mb-2">
              CSS 변수로 사용:
            </h4>
            <code className="bg-white px-3 py-1 rounded border text-neutral-600">
              background-color: var(--primary-500);
            </code>
          </div>
          <div>
            <h4 className="font-medium text-neutral-700 mb-2">
              유틸리티 클래스로 사용:
            </h4>
            <code className="bg-white px-3 py-1 rounded border text-neutral-600">
              className=&quot;bg-primary-500 text-white&quot;
            </code>
          </div>
          <div>
            <h4 className="font-medium text-neutral-700 mb-2">
              Semantic 컬러 사용:
            </h4>
            <code className="bg-white px-3 py-1 rounded border text-neutral-600">
              className=&quot;bg-success text-white&quot; (성공 메시지)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
