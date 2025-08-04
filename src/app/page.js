"use client";

import { useQuery } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";
import { Spinner } from "@/components/Spinner";
import styles from "./page.module.css";
import Link from "next/link";

const fetchPosts = async ({ page }) => {
  const results = await fetch(`http://localhost:3000/api/posts?page=${page}`);

  const data = await results.json();

  return data;
}

export default function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;
  
  const { data: posts, isLoading, isFetching } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts({ page: currentPage }),
    staleTime: 15000, //Tempo da resposta em cache
    //refetchInterval: 2000 Esse comandinho, faz a query ficar sendo repetida de acordo com o tempo que setamos aqui. (tipo um pooling)
    //refetchOnWindowFocus: true Esse comandinho por padrão é true, o que ele faz é, cada fez que a aba é focada no navegador, ele dispara a query novamente
  })

  const ratingsAndCartegoriesMap = null;

  return (
    <main className={styles.grid}>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      {posts?.data?.map((post) => (
        <CardPost
          key={post.id}
          post={post}
          rating={ratingsAndCartegoriesMap?.[post.id]?.rating}
          category={ratingsAndCartegoriesMap?.[post.id]?.category}
          isFetching={isFetching}
        />
      ))}
      <div className={styles.links}>
        {posts?.prev && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.prev, q: searchTerm },
            }}
          >
            Página anterior
          </Link>
        )}
        {posts?.next && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.next, q: searchTerm },
            }}
          >
            Próxima página
          </Link>
        )}
      </div>
    </main>
  );
}
