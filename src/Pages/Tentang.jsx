import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  ModalCloseButton,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import Batik from "../assets/BATIK.png";
import Layout from "../Components/Layout";
import GambarAplikasi from "../assets/tampilan APTEKA.png";
function Tentang() {
  return (
    <Layout>
      <Box
        pt={"80px"}
        bgColor={"rgba(249, 250, 251, 1)"}
        backgroundImage={`url(${Batik})`}
        pb={"40px"}
      >
        <Container
          p={"45px"}
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          my={"20px"}
        >
          <Image src={GambarAplikasi} />
          <Text align={"center"} fontWeight={700} fontSize={"25px"} mb={"30px"}>
            Tentang Aplikasi APTEKA
          </Text>
          <Text fontSize={"18px"} textAlign={"justify"} align={"right"}>
            APTEKA adalah singkatan dari Aplikasi Pengelolaan Terpadu
            Efektifitas Kefarmasian dan Alkes. Aplikasi ini dirancang untuk
            memenuhi kebutuhan pengelolaan data obat dan alat kesehatan di
            gudang farmasi yang dikelola oleh UPTD Perbekalan Obat dan Alkes,
            Dinas Kesehatan Kabupaten Paser. Nama APTEKA tidak hanya
            merepresentasikan fungsi aplikasi ini, tetapi juga diambil dari
            bahasa Rusia "аптека," yang berarti farmasi, mencerminkan inspirasi
            dan filosofi global dalam pengelolaan kefarmasian. Tujuan utama dari
            APTEKA adalah meningkatkan efisiensi dan akurasi dalam pencatatan,
            pelacakan, serta pengelolaan stok obat dan alat kesehatan. Dengan
            fitur-fitur yang dirancang khusus untuk kebutuhan gudang farmasi,
            APTEKA memungkinkan pengelola untuk: Memantau ketersediaan stok obat
            secara real-time. Mencatat penerimaan dan distribusi obat dengan
            lebih mudah dan transparan. Menghasilkan laporan pengelolaan obat
            yang akurat dan dapat diandalkan. Memastikan kontrol yang ketat
            terhadap obat-obatan mendekati masa kedaluwarsa. Aplikasi ini
            diharapkan dapat mendukung upaya pemerintah Kabupaten Paser dalam
            meningkatkan pelayanan kesehatan kepada masyarakat. Dengan
            pengelolaan stok yang lebih baik, distribusi obat ke fasilitas
            kesehatan seperti puskesmas dan rumah sakit dapat berjalan dengan
            lebih lancar, tepat waktu, dan sesuai kebutuhan. APTEKA adalah
            langkah inovatif dalam memanfaatkan teknologi digital untuk
            mendukung pengelolaan kefarmasian yang lebih efektif, efisien, dan
            transparan. Dengan hadirnya APTEKA, gudang farmasi Kabupaten Paser
            siap menjawab tantangan modernisasi sistem kesehatan dan terus
            berkomitmen untuk memberikan pelayanan terbaik bagi masyarakat.
          </Text>
        </Container>
      </Box>
    </Layout>
  );
}

export default Tentang;
