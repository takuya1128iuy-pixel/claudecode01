import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { TastingRecord } from "../types";

interface Props {
  records: TastingRecord[];
}

function avg(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default function PreferenceSummary({ records }: Props) {
  const stats = useMemo(() => {
    if (records.length === 0) return null;

    const overallSweetness = avg(records.map((r) => r.sweetness));
    const overallRichness = avg(records.map((r) => r.richness));
    const overallAroma = avg(records.map((r) => r.aroma));
    const overallRating = avg(records.map((r) => r.rating));

    // 高評価（4以上）だけに絞った"好みの傾向"
    const loved = records.filter((r) => r.rating >= 4);
    const lovedSweetness = loved.length ? avg(loved.map((r) => r.sweetness)) : overallSweetness;
    const lovedRichness = loved.length ? avg(loved.map((r) => r.richness)) : overallRichness;
    const lovedAroma = loved.length ? avg(loved.map((r) => r.aroma)) : overallAroma;

    const tagCount = new Map<string, { count: number; ratingSum: number }>();
    records.forEach((r) => {
      r.tags.forEach((t) => {
        const cur = tagCount.get(t) ?? { count: 0, ratingSum: 0 };
        cur.count += 1;
        cur.ratingSum += r.rating;
        tagCount.set(t, cur);
      });
    });
    const tagStats = [...tagCount.entries()]
      .map(([tag, v]) => ({ tag, count: v.count, avgRating: v.ratingSum / v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const breweryCount = new Map<string, number>();
    records.forEach((r) => {
      if (!r.brewery) return;
      breweryCount.set(r.brewery, (breweryCount.get(r.brewery) ?? 0) + 1);
    });
    const topBrewery = [...breweryCount.entries()].sort((a, b) => b[1] - a[1])[0];

    const radarData = [
      { axis: "甘辛(辛口寄り)", value: lovedSweetness },
      { axis: "濃醇度", value: lovedRichness },
      { axis: "香りの華やかさ", value: lovedAroma },
    ];

    const topTag = tagStats[0];

    let insight = `記録が${records.length}件たまりました。`;
    if (loved.length > 0) {
      insight += ` 高評価（★4以上）の${loved.length}件は、甘辛度${lovedSweetness.toFixed(
        1
      )}／濃醇度${lovedRichness.toFixed(1)}／香りの強さ${lovedAroma.toFixed(
        1
      )}（各5段階）が平均的な傾向です。`;
    }
    if (topTag) {
      insight += ` よく選ばれているタグは「${topTag.tag}」（平均★${topTag.avgRating.toFixed(
        1
      )}）です。`;
    }
    if (topBrewery) {
      insight += ` 記録が多い蔵元は「${topBrewery[0]}」でした。`;
    }

    return {
      overallRating,
      radarData,
      tagStats,
      topBrewery,
      insight,
      count: records.length,
    };
  }, [records]);

  if (!stats) {
    return (
      <div className="text-center text-stone-400 py-16 border border-dashed border-stone-300 rounded-xl bg-white">
        記録がまだないため、好みの傾向を表示できません。まずは1件記録してみましょう。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm text-left">
        <h3 className="text-sm font-semibold text-[color:var(--color-indigo)] mb-2">
          あなたの好みインサイト
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">{stats.insight}</p>
        <div className="flex gap-6 mt-3">
          <div>
            <p className="text-2xl font-semibold text-[color:var(--color-seal)]">
              {stats.overallRating.toFixed(1)}
            </p>
            <p className="text-xs text-stone-400">平均評価</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[color:var(--color-seal)]">
              {stats.count}
            </p>
            <p className="text-xs text-stone-400">記録数</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[color:var(--color-indigo)] mb-2 text-left">
            高評価銘柄の味わいプロファイル
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={stats.radarData} outerRadius="70%">
              <PolarGrid stroke="#e5e4e7" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#78716c" }} />
              <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Radar
                dataKey="value"
                stroke="#a6362c"
                fill="#a6362c"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[color:var(--color-indigo)] mb-2 text-left">
            よく選ぶ味わいタグ
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.tagStats} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="#f0ede6" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="tag"
                width={90}
                tick={{ fontSize: 11, fill: "#57534e" }}
              />
              <Tooltip formatter={(value) => [value, "件数"]} />
              <Bar dataKey="count" fill="#223a5e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
