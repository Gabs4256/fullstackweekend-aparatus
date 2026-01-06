import Image from "next/image";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import banner from "../public/banner.png";
import BookingItem from "./_components/booking-item";
import { prisma } from "@/lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import Footer from "./_components/footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "./_components/ui/page";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Buscar agendamentos confirmados do usuário
  const confirmedBookings = session
    ? await prisma.booking.findMany({
        where: {
          userId: session.user.id,
          cancelled: false,
          date: {
            gte: new Date(),
          },
        },
        include: {
          service: true,
          barbershop: true,
        },
        orderBy: {
          date: "asc",
        },
        take: 3, // Mostrar apenas os 3 próximos
      })
    : [];

  const recommendedBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const popularBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  });

  return (
    <main>
      <Header />
      <PageContainer>
        <SearchInput />
        <Image
          src={banner}
          alt="Agende agora!"
          sizes="100vw"
          className="h-auto w-full"
        />

        {confirmedBookings.length > 0 && (
          <PageSection>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            <div className="space-y-3">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </PageSection>
        )}

        <PageSection>
          <PageSectionTitle>Recomendados</PageSectionTitle>
          <PageSectionScroller>
            {recommendedBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Populares</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
};

export default Home;