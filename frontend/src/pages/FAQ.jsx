import React from 'react'

function FAQ() {
  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white shadow-xl rounded-lg border border-gray-100 mt-10 font-sans">
      
      {/* サイトタイトル: サービス名と目的を明確化 */}
      <h1 className="text-4xl font-extrabold text-gray-800 border-b-4 border-amber-500 pb-3 mb-6 tracking-wide">
        ONSEN GOODS：温泉情報共有プラットフォーム
      </h1>
      
      {/* 説明文: 参加を促す表現に修正 */}
      <p className="text-lg text-gray-600 leading-relaxed mb-10 border-l-4 border-amber-300 pl-4 py-1">
        このサイトは、すべての温泉愛好家が情報検索、共有、追し、みんな温泉のデータベースを育てていためのプラットフォームです。<br />
        情報の質と信頼性を高めるため、一部の重要な機能にユーザーの貢献度に応じた権が必要になります。
      </p>
      
      {/* 権限についての見出し */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 mt-10 border-b-2 border-gray-200 pb-2">
        ユーザーランク（権限）について
      </h3>
      
      {/* 権限の説明: 貢献度を「レベルアップ」のように表現 */}
      <div className="bg-amber-50 p-6 rounded-lg mb-10 border border-amber-200">
        <p className="text-gray-700 leading-relaxed italic">
          ユーザー登録直後は「<span className="font-semibold text-amber-700">探湯者（たんとうしゃ）</span>」の権限が付与されます。<br />
          評価やコメントの投稿、情報の編集・追加といっ貢献活を行うと、あなた貢献度が上し、それに伴い利用可能な機能が増えていきます！
        </p>
      </div>
      
      {/* 権限リスト (Description List) */}
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* 探湯者 */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-amber-700 mb-1">探湯者 (初期ランク)</dt>
          <dd className="text-gray-600">すべての温泉情報閲覧と、各温泉へ評価・コメントの投ができます。</dd>
        </div>
        
        {/* 温泉家 */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-teal-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-teal-700 mb-1">温泉家 (貢献度20以上)</dt>
          <dd className="text-gray-600">水風呂、サウナ、露天風呂といった設備情報の投稿・編ができるようになります。</dd>
        </div>
        
        {/* 名湯案内人 */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-blue-700 mb-1">名湯案内人 (貢献度50以上)</dt>
          <dd className="text-gray-600">温泉所在説明など、核となる情報の編集・修正提案が可能になります。</dd>
        </div>
        
        {/* 温泉マイスター */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-red-700 mb-1">温泉マイスター (貢献度100以上)</dt>
          <dd className="text-gray-600">新規温泉データベースへの追、および既存温泉名編ができるようになります。</dd>
        </div>

        {/* 貢献度確認場所の調整 */}
        <div className='md:col-span-2 text-center mt-4'>
            <p className="text-sm text-gray-500">
                あなたの現在の貢献度は、画面上部マイページアイコからいつでもご確認いただけます。
            </p>
        </div>
      </dl>
      
    </div>
  )
}

export default FAQ