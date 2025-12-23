<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        return Article::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $article = Article::create([
            'title' => $request->title,
            'content' => $request->content,
            'source_url' => $request->source_url,
            'is_updated' => $request->is_updated ?? false,
        ]);

        return response()->json($article, 201);
    }

    public function show($id)
    {
        return Article::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $article->update($request->only([
            'title',
            'content',
            'source_url',
            'is_updated'
        ]));

        return response()->json($article);
    }

    public function destroy($id)
    {
        Article::findOrFail($id)->delete();
        return response()->json(['message' => 'Article deleted']);
    }
}
