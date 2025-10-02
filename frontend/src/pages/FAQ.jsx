import React from 'react'

function FAQ() {
  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white shadow-xl rounded-lg border border-gray-100 mt-10 font-sans">
      
      {/* サイトタイトル */}
      <h1 className="text-4xl font-extrabold text-gray-800 border-b-4 border-amber-500 pb-3 mb-6 tracking-wide">
        このサイトについて
      </h1>
      
      {/* 説明文 */}
      <p className="text-lg text-gray-600 leading-relaxed mb-10 border-l-4 border-amber-300 pl-4 py-1">
        このサイトでは**温泉**の検索・追加・登録などを行うことができます。<br />
        情報の信憑性の担保のため、一部機能にはユーザー登録・**ユーザー権限**が必要になります。
      </p>
      
      {/* 権限についての見出し */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 mt-10 border-b-2 border-gray-200 pb-2">
        ユーザーの権限について
      </h3>
      
      {/* 権限の説明 */}
      <div className="bg-amber-50 p-6 rounded-lg mb-10 border border-amber-200">
        <p className="text-gray-700 leading-relaxed italic">
          ユーザー登録をするとそのユーザーは「<span className="font-semibold text-amber-700">探湯者</span>」の権限が与えられます。<br />
          コメントや評価の投稿・温泉情報の編集・追加などを行うと**権限が上昇**していきます
        </p>
      </div>
      
      {/* 権限リスト (Description List) */}
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* 探湯者 */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-amber-700 mb-1">探湯者</dt>
          <dd className="text-gray-600">各温泉への評価・コメントができます。</dd>
        </div>
        
        {/* 温泉家 */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-teal-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-teal-700 mb-1">温泉家</dt>
          <dd className="text-gray-600">温泉の設備情報の投稿ができるようになります。</dd>
        </div>
        
        {/* 名湯案内人 */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-blue-700 mb-1">名湯案内人</dt>
          <dd className="text-gray-600">温泉の場所・説明の編集ができるようになります。</dd>
        </div>
        
        {/* 温泉マイスター */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition duration-300">
          <dt className="text-xl font-bold text-red-700 mb-1">温泉マイスター</dt>
          <dd className="text-gray-600">温泉の追加・温泉名の編集ができるようになります。</dd>
        </div>
        
      </dl>
      
    </div>
  )
}

export default FAQ