export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", params.id);
  
    if (error) return NextResponse.json(error, { status: 500 });
  
    return NextResponse.json(data);
  }
  